import { useFetcher } from "@api/api"
import { Message } from "@interfaces/community"
import { COMMUNITY_ID } from "@src/utils/constants";

interface GetAllPostsFromChannelTypes {
    refetchOnMount?: boolean;
    channelId: string; //A changer ?
}

export const useAllPosts = ({ refetchOnMount = true, channelId}: GetAllPostsFromChannelTypes) => {
    return useFetcher<any, Message[]>({ key: `community-${COMMUNITY_ID}-${channelId}-posts`, path: `/community/${COMMUNITY_ID}/${channelId}/posts`, refetchOnMount })
}