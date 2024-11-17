interface Comment {
    id?: number;
    type: string;
    post_id: number;
    comment: string;
    created_at: string | Date;
    user_uuid: string;
    channel_id: number;
    comment_count: number;
    tempId?: string;
    waiting?: boolean;
    reactions?: any;
    comment_id?: number | null;
    user_name?: string;
    waitingReactions: any;
    user_reacts: any;
    had_user_react: boolean;
    is_saved?: boolean;
    is_signaled?: boolean;
}

interface Message {
    id?: number | string;
    owner_uuid: string;
    tempId?: string;
    postId?: string;
    waiting?: boolean;
    content: string;
    reactions?: any;
    comments?: number;
    is_pinned: boolean;
    created_at: string | Date;
    channel_id: number;
    is_comment_disabled: boolean;
    is_archived: boolean;
    is_banned: boolean;
    comment_details: Comment[];
    user_name: string;
    had_user_react?: boolean;
    user_reacts?: any;
    waitingReactions?: any;
    temporaryReactionId: string;
    reactionType: string;
    react_uuid: string;
    reactOn?: string;
    post_id?: number;
    commentId?: number;
    is_update?: boolean;
}

export interface ChannelInterface {
    id: number;
    community_id: number;
    name: string;
    channel_type: number;
    new_posts_count: string;
    can_users_publish: boolean;
    description: string;
    members?: number;
    created_at?: string;
    created_by?: string;
    is_displayed?: boolean;
    messages: Message[];
}