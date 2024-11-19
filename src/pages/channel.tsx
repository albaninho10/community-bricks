import { useAllPosts } from "@api/channel.queries"
import { PostsList } from "@src/organisms/postsList";
import { useParams } from "react-router-dom";
import Document from '@tiptap/extension-document';
import Mention from '@tiptap/extension-mention';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Image from '@tiptap/extension-image';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Link from '@tiptap/extension-link';
import { generateHTML } from '@tiptap/html';

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