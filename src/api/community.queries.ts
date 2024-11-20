import { useFetcher } from "@api/api"
import { ChannelInterface } from "@interfaces/community"
import { COMMUNITY_ID } from "@src/utils/constants";
import { usePostStore } from "@stores/channelPost";
import { useEffect } from "react";

interface GetAllChannelsFromCommunityTypes {
    refetchOnMount?: boolean;
    withNotifications?: boolean;
    enabled?: boolean;
}

export const useAllChannels = ({ refetchOnMount = true, withNotifications = false, enabled = true }: GetAllChannelsFromCommunityTypes) => {

    const addChannels = usePostStore(state => state.addChannels);

    const { data, refetch, isError, error, isLoading } = useFetcher<any, ChannelInterface[]>({ key: `community-${COMMUNITY_ID}-channels${withNotifications ? "-with-notif" : "-without-notif"}`, path: `/community/${COMMUNITY_ID}/channels${withNotifications ? "?withNotifications=true" : "?withNotifications=false"}`, refetchOnMount, enabled });

    useEffect(() => {
        if (data) {
            addChannels(data);
        }
    }, [data, addChannels]);

    return { data, refetch, isError, error, isLoading };
}