import { useFetcher } from "@api/api"
import { ChannelInterface } from "@interfaces/community"
import { COMMUNITY_ID } from "@src/utils/constants";

interface GetAllChannelsFromCommunityTypes {
    refetchOnMount?: boolean;
    withNotifications?: boolean;
    enabled?: boolean;
}

export const useAllChannels = ({ refetchOnMount = true, withNotifications = false, enabled = true }: GetAllChannelsFromCommunityTypes) => {
    return useFetcher<any, ChannelInterface[]>({ key: `community-${COMMUNITY_ID}-channels${withNotifications ? "-with-notif" : "-without-notif"}`, path: `/community/${COMMUNITY_ID}/channels${withNotifications ? "?withNotifications=true" : "?withNotifications=false"}`, refetchOnMount, enabled })
}