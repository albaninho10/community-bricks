import { useAllPosts } from "@api/channel.queries"
import { InputPost } from "@src/molecules/inputPost";
import { PostsList } from "@src/organisms/postsList";
import { COMMUNITY_ID } from "@src/utils/constants";
import { useSocket } from "@src/websocket/useSocket";
import { usePostStore } from "@stores/channelPost";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const ChannelPage = () => {
    const { channelId } = useParams<{ channelId: string }>();
    if (!channelId) return null;
    const numberChannelId = parseInt(channelId);
    if (!channelId) return null;
    const { data, isError, isLoading } = useAllPosts({ refetchOnMount: false, channelId: channelId });
    const { subscribeToCommunity } = useSocket();

    let messages = usePostStore((state) => state.channels[channelId]?.posts || []);
    messages = messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    useEffect(() => {
        subscribeToCommunity(`${COMMUNITY_ID}`)
    }, [])
    return (

        <div className="w-full flex flex-col items-start justify-start gap-4 py-4">
            <div>channelPage</div>
            { !isError && !isLoading && messages?.length && <PostsList data={messages} isLoading={isLoading} /> }
            <InputPost communityId={`${COMMUNITY_ID}`} channelId={numberChannelId} />
        </div>
    )
}