import { useFetcher } from "@api/api"
import { Post } from "@interfaces/community"
import { COMMUNITY_ID } from "@src/utils/constants";
import { usePostStore } from "@stores/channelPost";
import { useEffect } from "react";

interface GetAllPostsFromChannelTypes {
    refetchOnMount?: boolean;
    channelId: string; //A changer ?
}

export const useAllPosts = ({ refetchOnMount = true, channelId}: GetAllPostsFromChannelTypes) => {
    const addPosts = usePostStore((state: any) => state.addPosts);

    const { data, refetch, isError, error, isLoading } = useFetcher<any, Post[]>({ key: `community-${COMMUNITY_ID}-${channelId}-posts`, path: `/community/${COMMUNITY_ID}/${channelId}/posts`, refetchOnMount })

    useEffect(() => {
        if (data) {
            addPosts(channelId, data);
        }
      }, [data, channelId, addPosts]);
    
      return { data, refetch, isError, error, isLoading };
}