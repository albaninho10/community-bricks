import { Comment, Post, ChannelInterface } from "@interfaces/community"
import { create } from "zustand";

interface PostState {
    channels: Record<string, ChannelInterface>;
    addPost: (post: Post) => void; //ajout d'un post dans le store en temps réel
}

export const usePostStore = create<PostState>((set) => ({
    channels: {},
    addPost: (post) => {
        set((state) => {
            const channelId = post.channel_id.toString();
            const channel = state.channels[channelId] || { posts: [], new_posts_count: "0" };
            const existingIndex = channel.posts.findIndex(msg => msg.id === post.id || msg.tempId === post.postId);
            let newPostsCount = parseInt(channel.new_posts_count || "0");
            if (existingIndex === -1){
                // activitystore etc ?
                return {
                    channels: {
                        ...state.channels,
                        [channelId]:{
                            ...channel,
                            posts: [...channel.posts, post],
                            new_posts_count: newPostsCount.toString()
                        }
                    }
                }
            } else {
                const updatedPosts = [...channel.posts];
                updatedPosts[existingIndex] = { ...updatedPosts[existingIndex], ...post, tempId: undefined, waiting: false };
        
                return {
                  channels: {
                    ...state.channels,
                    [channelId]: {
                      ...channel,
                      posts: updatedPosts
                    }
                  }
                };
              }
        })
    }
}))