import { useAllPosts } from "@api/channel.queries"
import { PostsList } from "@src/organisms/postsList";
import { useParams } from "react-router-dom";

export const ChannelPage = () => {
    const { channelId } = useParams<{ channelId: string }>();
    if (!channelId) return null;
    const { data, isError, isLoading } = useAllPosts({ refetchOnMount: false, channelId: channelId });

    return (
        <div className="w-full flex flex-col items-start justify-start gap-4 py-4">
            <div>channelPage</div>
            { !isError && data?.length && <PostsList data={data} isLoading={isLoading} /> }
        </div>
        
    )
}