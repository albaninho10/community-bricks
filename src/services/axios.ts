import axios, { type AxiosRequestConfig } from 'axios'
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from '@stores/auth'

export type RefreshTokenDataResponse = {
    accessToken: string
    refreshToken: string
}

export type RefreshTokenResponse = {
    data: RefreshTokenDataResponse
}

export type RefreshTokenBody = {
    refresh_token: string
    uuid: string
}

export interface JWTType {
    exp: number
    iat: number
    uuid: string
}

const axiosInstance = axios.create({ baseURL: "/api" });

const axiosRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
    const { headers = {}, ...restConfig } = config;
    const accessToken = useAuthStore.getState().tokens.accessToken 
    const authHeaders = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return axiosInstance({
        headers: { ...headers, ...authHeaders },
        ...restConfig,
    }).then(response => response.data);
};

export const axiosDelete = (url: string, timeout = 10000) =>
    axiosRequest({ method: 'DELETE', url, timeout });

export const axiosPut = <T>(url: string, body: T, timeout = 10000) =>
    axiosRequest({ method: 'PUT', url, data: body, timeout });

export const axiosPost = <RequestBody, ResponseData>(url: string, body: RequestBody, timeout = 10000): Promise<ResponseData> =>
    axiosRequest<ResponseData>({ method: 'POST', url, data: body, timeout });

export const axiosPostFormData = (url: string, formData: FormData, timeout = 10000) =>
    axiosRequest({ method: 'POST', url, data: formData, headers: { 'Content-Type': 'multipart/form-data' }, timeout });

export const axiosGet = <_, ResponseData>(url: string, params: any, timeout = 10000) =>
    axiosRequest<ResponseData>({ method: 'GET', url, params, timeout });

const setTokenExpired = () => {
    useAuthStore.getState().logout().catch(() => { console.log('token expired') })
}

const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = useAuthStore.getState().tokens.refreshToken ?? '';
    if (!refreshToken) throw new Error('No refresh token available');

    const { exp: refExp, uuid } = jwtDecode<JWTType>(refreshToken);
    if (refExp < Date.now() / 1000) throw new Error('JWT expired');

    const refreshBody = { refresh_token: refreshToken, uuid };
    const response = await axiosPost<RefreshTokenBody, RefreshTokenResponse>('/auth/refresh-token', refreshBody);
    await useAuthStore.getState().saveTokens(response.data);
    return response.data.accessToken;
};

let refreshingPromise: Promise<string> | null = null;

axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const { config, response: { status } = { status: undefined } } = error;

        if (status === 401) {
            if (!refreshingPromise) {

                refreshingPromise = refreshAccessToken().then(newAccessToken => {
                    config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    refreshingPromise = null;
                    return newAccessToken;
                }).catch(refreshError => {
                    refreshingPromise = null;
                    setTokenExpired();
                    throw refreshError;
                });
            }

            try {
                const newAccessToken = await refreshingPromise;
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(config);
            } catch (error) {
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);
