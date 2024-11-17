import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getStorage } from '@services/base'

interface UserTokens {
    accessToken?: string
    refreshToken?: string
}

export interface AuthStore {
    isLogged: boolean
    isManualDisconnection: boolean
    isRefreshingToken: boolean
    email: string
    tokens: UserTokens
    uuid: string
    userName: string

    clearAccessToken: () => void
    saveTokens: (loginData: any) => Promise<void>
    login: (email: string, loginData: any) => Promise<void>
    logout: (isManual?: boolean) => Promise<void>
    finishLogout: (isManual?: boolean) => void
}

export const uuidSelector = (state: AuthStore) => state.uuid

export const tokensSelector = (state: AuthStore) =>
    state.tokens

export const userNameSelector = (state: AuthStore) =>
    state.userName

export const loginSelector = (state: AuthStore) =>
    state.login

export const logoutSelector = (state: AuthStore) =>
    state.logout



export const useAuthStore = create(persist<AuthStore>((set, get) => ({
    isLogged: false,
    isManualDisconnection: false,
    isRefreshingToken: false,
    email: '',
    tokens: {},
    userName: '',
    uuid: '',

    clearAccessToken: () => {
        set(state => ({
            ...state,
            tokens: {
                ...state.tokens,
                accessToken: undefined
            }
        }))
    },

    login: async (email: string, loginData: any) => {

        try {
            set(state => ({
                ...state,
                isLogged: true,
                isManualDisconnection: false,
                lastLoginAttemptTime: '',
                isEmailVerified: false,
                isProfileComplete: false,
                loginFailedAttempts: 0,
                email: email,
                uuid: loginData.uuid,
                userName: loginData.user_name
            }))
            await Promise.all([
                get().saveTokens(loginData).catch(() => { console.log('Error saving tokens') }),
            ])

        } catch (e) {
            console.log(e)
        }
    },

    saveTokens: async (loginData: any) => {
        set(state => ({
            ...state,
            tokens: {
                ...state.tokens,
                accessToken: loginData.accessToken,
                refreshToken: loginData.refreshToken
            }
        }))
    },

    logout: async (isManual = false) => {
        get().finishLogout(isManual)
    },

    finishLogout: (isManual = false) => {
        set(state => ({
            ...state,
            isLogged: false,
            userName: '',
            uuid: '',
            isManualDisconnection: isManual,
            email: '',
            isEmailVerified: false,
            isProfileComplete: false,
            tokens: {}
        }))
    }
}),
    {
        name: 'auth-store',
        partialize: (state) => {
            const whitelist = [
                'isLogged',
                'email',
                'tokens',
                'uuid',
                'isEmailVerified',
                'isProfileComplete',
                'userName'
            ]

            return Object.fromEntries(
                Object.entries(state).filter(([key]) => whitelist.includes(key))
            ) as AuthStore
        },
        storage: getStorage()
    }))