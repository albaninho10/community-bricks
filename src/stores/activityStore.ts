import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getStorage } from './base'

interface Timestamps {
    permanent: Record<string, number>;
    temporary: Record<string, number>;
}

interface ApiResponse {
    communities: Record<string, string>;
    channels: Record<string, string>;
    updated_at: Date;
}

export interface ActivityStoreInterface {
    channelTimestamps: Timestamps;
    communityTimestamps: Timestamps;
    apiResponse: ApiResponse | null;
    localChannels: Record<string, number>;
    updateChannelTimestamp: (channelId: string) => void;
    updateCommunityTimestamp: (communityId: string) => void;
    getUnreadStatus: (channelId: string) => boolean;
    setApiResponse: (response: ApiResponse) => void;
    updateLocalChannel: (channelId: string, timestamp: number) => void;
    getTemporaryActivities: () => {
        channels: Record<string, number>;
        communities: Record<string, number>;
    };
    clearTemporaryActivities: () => void;
    clearAllTimestamps: () => void;
    getLastChannelOpenDate: (channelId: string) => Date | null;
}

type PersistedState = {
    channelTimestamps: { permanent: Record<string, number> };
    communityTimestamps: { permanent: Record<string, number> };
    localChannels: Record<string, number>;
};

export const useActivityStore = create<ActivityStoreInterface>()(
    persist(
        (set, get) => ({
            channelTimestamps: { permanent: {}, temporary: {} },
            communityTimestamps: { permanent: {}, temporary: {} },
            apiResponse: null,
            localChannels: {},
            updateChannelTimestamp: (channelId: string) => set((state) => {
                const now = Date.now();
                return {
                    channelTimestamps: {
                        permanent: {
                            ...state.channelTimestamps.permanent,
                            [channelId]: now,
                        },
                        temporary: {
                            ...state.channelTimestamps.temporary,
                            [channelId]: now,
                        },
                    },
                    localChannels: {
                        ...state.localChannels,
                        [channelId]: now,
                    },
                };
            }),
            updateCommunityTimestamp: (communityId: string) => set((state) => ({
                communityTimestamps: {
                    permanent: {
                        ...state.communityTimestamps.permanent,
                        [communityId]: Date.now(),
                    },
                    temporary: {
                        ...state.communityTimestamps.temporary,
                        [communityId]: Date.now(),
                    },
                },
            })),
            getUnreadStatus: (channelId: string) => {
                const state = get();
                const apiTimestamp = state.apiResponse?.channels[channelId] ? new Date(state.apiResponse.channels[channelId]).getTime() : 0;
                const localTimestamp = state.localChannels[channelId] || 0;
                const lastReadTimestamp = state.channelTimestamps.permanent[channelId] || 0;

                const latestTimestamp = Math.max(apiTimestamp, localTimestamp);
                return latestTimestamp > lastReadTimestamp;
            },
            setApiResponse: (response: ApiResponse) => set({ apiResponse: response }),
            updateLocalChannel: (channelId: string, timestamp: number) => set((state) => ({
                localChannels: {
                    ...state.localChannels,
                    [channelId]: timestamp,
                },
            })),
            getTemporaryActivities: () => {
                const state = get();
                return {
                    channels: state.channelTimestamps.temporary,
                    communities: state.communityTimestamps.temporary,
                };
            },
            clearTemporaryActivities: () => set((state) => ({
                channelTimestamps: {
                    ...state.channelTimestamps,
                    temporary: {},
                },
                communityTimestamps: {
                    ...state.communityTimestamps,
                    temporary: {},
                },
            })),
            clearAllTimestamps: () => set({
                channelTimestamps: { permanent: {}, temporary: {} },
                communityTimestamps: { permanent: {}, temporary: {} },
                localChannels: {},
            }),
            getLastChannelOpenDate: (channelId: string) => {
                const state = get();
                if (channelId in state.localChannels) {
                    return new Date(state.localChannels[channelId]);
                } else if (state.apiResponse?.channels[channelId]) {
                    return new Date(state.apiResponse.channels[channelId]);
                }
                return null;
            },
        }),
        {
            name: 'activity-store',
            partialize: (state): PersistedState => ({
                channelTimestamps: { permanent: state.channelTimestamps.permanent },
                communityTimestamps: { permanent: state.communityTimestamps.permanent },
                localChannels: state.localChannels,
            }),
            storage: getStorage<PersistedState>(),
        }
    )
)