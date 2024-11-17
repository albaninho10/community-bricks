import { useQuery, QueryKey, useMutation, MutationOptions, useInfiniteQuery } from '@tanstack/react-query';
import { axiosGet, axiosPost, axiosPostFormData } from '@services/axios';

interface FetcherType {
    key: QueryKey | string;
    path: string;
    refetchOnWindowFocus?: boolean;
    refetchOnReconnect?: boolean;
    refetchOnMount?: boolean;
    enabled?: boolean;
    keepPreviousData?: boolean;
    cacheTime?: number;
}

interface InfiniteFetcherType<P> {
    key: QueryKey;
    path: string;
    refetchOnReconnect?: boolean;
    refetchOnMount?: boolean;
    refetchOnWindowFocus?: boolean;
    enabled?: boolean;
    gcTime?: number;
    params?: P;
    initialPageParam?: number;
    limit: number;
}

interface InfiniteResponse<T> {
    list: T[];
    page: number;
    nextPage: number | null;
}

export type MutatorType = {
    key: string;
    path: string;
};

export const useFetcher = <PARAMS, RESPONSE>({
    key,
    path,
    refetchOnWindowFocus = false,
    refetchOnMount = false,
    enabled = true
}: FetcherType) => {
    return useQuery<RESPONSE, Error>({
        queryKey: Array.isArray(key) ? key : [key],
        queryFn: async (): Promise<RESPONSE> => {
            const returnedItem = await axiosGet<PARAMS, RESPONSE>(path, {});
            return (returnedItem as any).data;
        },
        refetchOnWindowFocus,
        refetchOnMount,
        retry: 0,
        refetchOnReconnect: false,
        enabled,
    });
};

export const useInfiniteFetcher = <T, P = any>({
    key,
    path,
    limit = 10,
    refetchOnReconnect = false,
    refetchOnMount = false,
    refetchOnWindowFocus = false,
    enabled = true,
    gcTime = 1000 * 60 * 60,
    initialPageParam = 1,
    params
}: InfiniteFetcherType<P>) => {
    const result = useInfiniteQuery<InfiniteResponse<T>, Error>({
        queryKey: key,
        queryFn: async ({ pageParam = 1 }) => {
            const fullPath = `${path}?page=${pageParam}&limit=${limit}`;
            const returnedItem = await axiosGet<P, InfiniteResponse<T>>(fullPath, params || {});
            return (returnedItem as any).data;
        },
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
        staleTime: Infinity,
        gcTime,
        refetchOnMount,
        refetchOnWindowFocus,
        refetchOnReconnect,
        initialPageParam,
        enabled,
        retry: 0
    });

    const allItems = result.data ? result.data.pages.flatMap(page => page.list) : [];

    return {
        ...result,
        allItems
    };
};


export const useMutator = <T>(path: string, opts: MutationOptions = {}) => {

    const func = async (data: T) => {
        const returnedItem = await axiosPost(path, data);
        return (returnedItem as any).data;
    }

    return useMutation<any, unknown, T>({ ...opts, mutationFn: func } as any);
}

export const useFileMutator = <T>(path: string, opts: MutationOptions = {}) => {

    const func = async (formData: FormData) => {
        const returnedData = await axiosPostFormData(path, formData, undefined);
        return (returnedData as any).data;
    };

    return useMutation<any, unknown, T>({ ...opts, mutationFn: func } as any);
}