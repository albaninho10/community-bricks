
import { useMutator } from '@api/api';
import { useAuthStore, userNameSelector, uuidSelector } from '@stores/auth';
import { usePostStore } from '@stores/channelPost';
import { v4 as uuidv4 } from 'uuid';

export type SendPostType = {
    communityId: string;
    channelId: any;
};

export type SendPostContent = {
    content: any;
}   

export const useSendPost = ({ communityId, channelId } : SendPostType ) => {
    
    const { mutateAsync: sendNewPost } = useMutator<any>(`/community/${communityId}/${channelId}/post/new`);
    const addWaitingPost = usePostStore(state => state.addWaitingPost);
    const uuid : any = useAuthStore(uuidSelector);
    const userName : any = useAuthStore(userNameSelector);
    
    const sendMessage = ({ content }: SendPostContent ) => {
        const uniqueId = uuidv4() + "_" + new Date().getTime();
        //@ts-ignore
        addWaitingPost(channelId, { content, tempId: uniqueId, waiting: true, owner_uuid: uuid, user_name: userName, id: uniqueId, is_pinned: false, created_at: new Date(), channel_id : channelId, is_comment_disabled: false, is_archived : false, is_banned: false, comment_details: [] }, uniqueId);
        return sendNewPost({ content, postId: uniqueId });
    };

    return { sendMessage };
};
