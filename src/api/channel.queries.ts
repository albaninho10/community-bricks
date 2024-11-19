import { useFetcher } from "@api/api"
import { Post } from "@interfaces/community"
import { COMMUNITY_ID } from "@src/utils/constants";

interface GetAllPostsFromChannelTypes {
    refetchOnMount?: boolean;
    channelId: string; //A changer ?
}

export const useAllPosts = ({ refetchOnMount = true, channelId}: GetAllPostsFromChannelTypes) => {
    return useFetcher<any, Post[]>({ key: `community-${COMMUNITY_ID}-${channelId}-posts`, path: `/community/${COMMUNITY_ID}/${channelId}/posts`, refetchOnMount })
}