import { useAllPosts } from "@api/channel.queries"
import { useParams } from "react-router-dom";

export const ChannelPage = () => {
    const { channelId } = useParams<{ channelId: string }>();
    if (!channelId) return null;
    useAllPosts({ refetchOnMount: false, channelId: channelId });
    return (
        <div>channelPage</div>
    )
}