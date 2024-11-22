import { Comment, Post, ChannelInterface } from "@interfaces/community"
import { create } from "zustand";
import { useActivityStore } from "./activityStore";

interface PostState {
    channels: Record<string, ChannelInterface>;
    addPost: (post: Post) => void; //ajout d'un post dans le store en temps réel
    addPosts: (channelId: number, newPosts: Post[]) => void;
    addWaitingPost: (channelId: number, post: Post, tempId: string) => void;
    addWaitingUpdatePost: (channelId: number, post: Post) => void;
    addUpdatePost: (channelId: number, postId: number, content: string) => void;
    addComment: (comment: Comment) => void;
    addComments: (channelId: number, postId: number, comments: Comment[]) => void;
    addWaitingComment: (channelId: number, postId: number, comment: Comment, tempId: string) => void;
    addReaction: (post: Post, uuid: string) => void;
    deleteReaction: (post: Post, uuid: string) => void;
    addWaitingReaction: (post: Post, tempId: string, userId: string, type: string) => void;
    updateChannelInfo: (channelId: number, channelInfo: Partial<ChannelInterface>) => void;
    addChannels: (channels: ChannelInterface[]) => void;
    resetNewPostsCount: (channelId: string) => void;
    updatePostSavedStatus: (channelId: number, postId: number, isSaved: boolean) => void;
    updatePostSignaledStatus: (channelId: number, postId: number, isSignaled: boolean) => void;
}

export const usePostStore = create<PostState>((set) => ({
    channels: {},
    addPost: (post) => {
        set((state) => {
            console.log("tets")
            const channelId = post.channel_id.toString();
            const channel = state.channels[channelId] || { posts: [], new_posts_count: "0" };
            const existingIndex = channel.posts.findIndex(post => post.id === post.id || post.tempId === post.postId);
            if (existingIndex === -1){
                // Nouveau post
                const activityStore = useActivityStore.getState();
                const lastVisit = activityStore.channelTimestamps.permanent[channelId] || 0;
                const messageDate = new Date(post.created_at).getTime();

                let newPostsCount = parseInt(channel.new_posts_count || "0");
                if (messageDate > lastVisit) {
                    newPostsCount += 1;
                }
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
                // Mise à jour d'un post existant
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
    },

    addPosts: (channelId, newPosts) => {
        set((state) => {
          const channel = state.channels[channelId.toString()] || { posts: [] };
          const existingPosts = channel.posts;
          const filteredPosts = newPosts.filter(newPost => !existingPosts.some(post => post.id === newPost.id));
          return {
            channels: {
              ...state.channels,
              [channelId.toString()]: {
                ...channel,
                posts: [...existingPosts, ...filteredPosts]
              }
            }
          };
        });
      },

    addWaitingPost: (channelId, post, tempId) => {
        set((state) => {
            const channel = state.channels[channelId.toString()] || { posts: [] };
            const newPost = { ...post, waiting: true, tempId };
            return {
                channels: {
                    ...state.channels,
                    [channelId.toString()]: {
                        ...channel,
                        posts: [...channel.posts, newPost]
                    }
                }
            };
        });
    },

    addWaitingUpdatePost: (channelId, post) => {
        set((state) => {
          const channel = state.channels[channelId.toString()];
          if (!channel) return state;
    
          const updatedPosts = channel.posts.map((p: Post) => {
            if (p.id === post.id) {
              return {
                ...p,
                content: post.content,
                is_update: true,
                waiting: true,
              };
            }
            return p;
          });
    
          return {
            channels: {
              ...state.channels,
              [channelId.toString()]: {
                ...channel,
                posts: updatedPosts
              }
            }
          };
        });
      },

    addUpdatePost: (channelId, postId, content) => {
        set((state) => {
            const channel = state.channels[channelId.toString()];
            if (!channel) return state;

            const updatedPosts = channel.posts.map((p: Post) => {
                if (p.id === postId){
                    return {
                        ...p,
                        content: content,
                        waiting: false,
                    };
                }
                return p;
            })
            return {
                channels: {
                    ...state.channels,
                    [channelId.toString()]: {
                        ...channel,
                        posts: updatedPosts
                    }
                }
            }
        })
    },

    addComment: (comment) => {
        set((state) => {
            const channelId = comment.channel_id;
            const channel = state.channels[channelId];
            if (!channel) return state;
            const updatedPosts = channel.posts.map((p: Post) => {
                if (p.id === parseInt(comment.post_id as any)) {
                    let updatedCommentDetails = p.comment_details ?? [];
                    const index = updatedCommentDetails.findIndex(cmt => cmt.tempId === comment.tempId || cmt.id === comment.id);
        
                    if (index > -1) { // Update d'un commentaire
                        updatedCommentDetails[index] = { ...updatedCommentDetails[index], ...comment, waiting: false, tempId: undefined };
                    } else { // Nouveau commentaire
                        updatedCommentDetails.push(comment);
                    }
        
                    return { ...p, comment_details: updatedCommentDetails, comments: updatedCommentDetails.length };
                }
                return p;
            });

            return {
                channels: {
                    ...state.channels,
                    [channelId.toString()]: {
                        ...channel,
                        posts: updatedPosts
                    }
                }
            }
        })
    },

    addComments: (channelId, postId, comments) => {
        set((state) => {
            const channel = state.channels[channelId];
            if (!channel) return state;
            const updatedPosts = channel.posts.map((p: Post) => {
                if (p.id === postId){
                    const existingCommentIds = new Set(p.comment_details?.map((cmt: Comment)=> cmt.id));
                    const filteredComments = comments.filter(cmt => !existingCommentIds.has(cmt.id));
                    const newCommentDetails = [...(p.comment_details ?? []), ...filteredComments];
                    return { ...p, comment_details: newCommentDetails };
                }
                return p;
            });

            return {
                channels: {
                    ...state.channels,
                    [channelId.toString()]: {
                        ...channel,
                        posts: updatedPosts
                    }
                }
            }
        })
    },

    addWaitingComment: (channelId, postId, comment, tempId) => {
        set((state) => {
            const channel = state.channels[channelId];
            if (!channel) return state;

            const updatedPosts = channel.posts.map((p: Post) => {
                if (p.id === postId) {
                    const newCommentDetails = [...(p.comment_details ?? []), { ...comment, waiting: true, tempId }];
                    return { ...p, comment_details: newCommentDetails };
                }
                return p;
            });

            return {
                channels: {
                    ...state.channels,
                    [channelId.toString()]: {
                        ...channel,
                        posts: updatedPosts
                    }
                }
            }
        })
    }, 

    addReaction: (post, uuid) => {
        set((state) => {
            const channelId = post.channel_id.toString();
            const channel = state.channels[channelId];
            if (!channel) return state;

            const updatedPosts = channel.posts.map((p: Post) => {
                if (post.reactOn === "post" && p.id === post.id){
                    const newWaitingReactions = { ...p.waitingReactions };
                    const userReacts = p.user_reacts || [];
                    let hadUserReact = p.had_user_react || false;
          
                    if (post.temporaryReactionId && newWaitingReactions[post.temporaryReactionId]) {
                      delete newWaitingReactions[post.temporaryReactionId];
                    }
          
                    if (post.react_uuid === uuid && !userReacts.includes(post.reactionType)) {
                      userReacts.push(post.reactionType);
                      hadUserReact = true;
                    }
          
                    return {
                        ...p,
                        reactions: post.reactions,
                        waitingReactions: newWaitingReactions,
                        user_reacts: userReacts,
                        had_user_react: hadUserReact,
                    };
                } else if (post.reactOn === "comment" && p.id === post.post_id){
                    const updatedCommentDetails = p.comment_details?.map(comment => {
                        if (comment.id === post.id) {
                            const commentReactions = comment.reactions || {};
                            const newWaitingReactions = { ...comment.waitingReactions };
                            const userReacts = comment.user_reacts || [];
                            let hadUserReact = comment.had_user_react || false;
            
                            if (post.temporaryReactionId && newWaitingReactions[post.temporaryReactionId]) {
                            delete newWaitingReactions[post.temporaryReactionId];
                            }
            
                            if (post.react_uuid === uuid && !userReacts.includes(post.reactionType)) {
                            hadUserReact = true;
                            userReacts.push(post.reactionType);
                            }
            
                            commentReactions[post.reactionType] = (Number(commentReactions[post.reactionType]) || 0) + 1;
            
                            return {
                                ...comment,
                                reactions: post.reactions,
                                waitingReactions: newWaitingReactions,
                                user_reacts: userReacts,
                                had_user_react: hadUserReact,
                            };
                        }
                        return comment;
                    });
                    return { ...p, comment_details: updatedCommentDetails };
                }
                return p;
            });
            return {
                channels: {
                  ...state.channels,
                  [channelId]: {
                    ...channel,
                    posts: updatedPosts
                  }
                }
            };
        })
    },

    deleteReaction: (post, uuid) => {
        set((state) => {
            const channelId = post.channel_id.toString();
            const channel = state.channels[channelId];
            if (!channel) return state;
        
            const updatedPosts = channel.posts.map(p => {
                if (post.reactOn === "post" && p.id === post.id) {
                    const newWaitingReactions = { ...p.waitingReactions };
                    const userReacts = [...(p.user_reacts || [])];
                    let hadUserReact = p.had_user_react || false;
            
                    // Supprime la réaction temporaire si elle existe
                    if (post.temporaryReactionId && newWaitingReactions[post.temporaryReactionId]) {
                        delete newWaitingReactions[post.temporaryReactionId];
                    }
            
                    // Si l'UUID correspond, on retire la réaction de l'utilisateur
                    if (post.react_uuid === uuid && userReacts.includes(post.reactionType)) {
                        const index = userReacts.indexOf(post.reactionType);
                        userReacts.splice(index, 1);
                        hadUserReact = userReacts.length > 0; // Met à jour had_user_react en fonction des réactions restantes
                    }
            
                    return {
                        ...p,
                        reactions: post.reactions, // Les nouvelles réactions mises à jour venant du backend
                        waitingReactions: newWaitingReactions,
                        user_reacts: userReacts,
                        had_user_react: hadUserReact,
                    };
                } else if (post.reactOn === "comment" && p.id === post.post_id) {
                    const updatedCommentDetails = p.comment_details?.map(comment => {
                        if (comment.id === post.id) {
                        const commentReactions = { ...comment.reactions };
                        const newWaitingReactions = { ...comment.waitingReactions };
                        const userReacts = [...(comment.user_reacts || [])];
                        let hadUserReact = comment.had_user_react || false;
            
                        // Supprime la réaction temporaire
                        if (post.temporaryReactionId && newWaitingReactions[post.temporaryReactionId]) {
                            delete newWaitingReactions[post.temporaryReactionId];
                        }
            
                        // Si l'UUID correspond, on retire la réaction
                        if (post.react_uuid === uuid && userReacts.includes(post.reactionType)) {
                            const index = userReacts.indexOf(post.reactionType);
                            userReacts.splice(index, 1);
                            hadUserReact = userReacts.length > 0;
            
                            // Décrémente le compteur de réactions pour ce type
                            if (commentReactions[post.reactionType]) {
                                commentReactions[post.reactionType] = Math.max(0, (commentReactions[post.reactionType] || 0) - 1);
                                if (commentReactions[post.reactionType] === 0) {
                                    delete commentReactions[post.reactionType];
                                }
                            }
                        }
        
                        return {
                            ...comment,
                            reactions: post.reactions || commentReactions,
                            waitingReactions: newWaitingReactions,
                            user_reacts: userReacts,
                            had_user_react: hadUserReact,
                        };
                    }
                return comment;
            });
    
                    return { ...p, comment_details: updatedCommentDetails };
                }
                return p;
            });
    
            return {
                channels: {
                    ...state.channels,
                    [channelId]: {
                        ...channel,
                        posts: updatedPosts
                    }
                }
            };
        });
    },

    addWaitingReaction: (post, reactionType, tempId, type) => {
        set((state) => {
            const channelId = post.channel_id.toString();
            const channel = state.channels[channelId];
            if (!channel) return state;
        
            const updatedPosts = channel.posts.map(p => {
                if (p.id === post.id) {
                    if (type === 'post') {
                        
                        const reactions = p.reactions || {};
                        const waitingReactions = p.waitingReactions || {};
                        const userReacts = p.user_reacts || [];
                        let hadUserReact = p.had_user_react || false;
                        const currentReactionsCount = Number(reactions[reactionType]) || 0;
                        
                        if (!userReacts.includes(reactionType)) {
                            userReacts.push(reactionType);
                            hadUserReact = true;
                            reactions[reactionType] = currentReactionsCount + 1;
                        } else {
                            reactions[reactionType] = currentReactionsCount - 1;
                            if (reactions[reactionType] === 0) {
                                delete reactions[reactionType];
                            }
                            userReacts.splice(userReacts.indexOf(reactionType), 1);
                        }
                        waitingReactions[tempId] = reactionType;
            
                        return { ...p, reactions, waitingReactions, user_reacts: userReacts, had_user_react: hadUserReact };
                    }
            
                    if (type === 'comment' && post.commentId) {
                        const updatedCommentDetails = p.comment_details.map(comment => {
                        if (comment.id === post.commentId) {
                            const commentReactions = comment.reactions || {};
                            const waitingReactions = comment.waitingReactions || {};
                            const userReacts = comment.user_reacts || [];
                            let hadUserReact = comment.had_user_react || false;
                            const currentReactionsCount = Number(commentReactions[reactionType]) || 0;
                            commentReactions[reactionType] = currentReactionsCount + 1;
            
                            if (!userReacts.includes(reactionType)) {
                                userReacts.push(reactionType);
                                hadUserReact = true;
                            }
                            waitingReactions[tempId] = reactionType;
            
                            return { ...comment, reactions: commentReactions, waitingReactions, user_reacts: userReacts, had_user_react: hadUserReact };
                        }
                        return comment;
                        });
            
                        return { ...p, comment_details: updatedCommentDetails };
                    }
                }
                return p;
            });
        
            return {
                channels: {
                    ...state.channels,
                    [channelId]: {
                        ...channel,
                        posts: updatedPosts
                    }
                }
            };
        });
    },

    updateChannelInfo: (channelId, channelInfo) => {
        set((state) => ({
            channels: {
                ...state.channels,
                [channelId.toString()]: {
                    ...state.channels[channelId.toString()],
                    ...channelInfo
                }
            }
        }));
    },

    addChannels: (channels) => {
        set((state) => {
            const updatedChannels = { ...state.channels };
            channels.forEach(channel => {
                updatedChannels[channel.id.toString()] = {
                    ...channel,
                    posts: state.channels[channel.id.toString()]?.posts || []
                };
            });
            return { channels: updatedChannels };
        });
    },
    
    resetNewPostsCount: (channelId: string) => {
        set((state) => {
            const channel = state.channels[channelId];
            if (!channel) return state;

            return {
                channels: {
                    ...state.channels,
                    [channelId.toString()]: {
                        ...channel,
                        new_posts_count: "0"
                    }
                }
            };
        });
    },

    updatePostSavedStatus: (channelId, postId, isSaved) => {
        set((state) => {
            const channel = state.channels[channelId.toString()];
            if (!channel) return state;

            const updatedPosts = channel.posts.map(p => {
                if (p.id === postId) {
                    return { ...p, is_saved: isSaved };
                }
                return p;
            });

            return {
                channels: {
                    ...state.channels,
                    [channelId.toString()]: {
                        ...channel,
                        posts: updatedPosts
                    }
                }
            };
        });
    },
    
    updatePostSignaledStatus: (channelId, postId, isSignaled) => {
        set((state) => {
            const channel = state.channels[channelId.toString()];
            if (!channel) return state;
        
            const updatedPosts = channel.posts.map(p => {
                if (p.id === postId) {
                    return { ...p, is_signaled: isSignaled };
                }
                return p;
            });
        
            return {
                channels: {
                    ...state.channels,
                    [channelId.toString()]: {
                        ...channel,
                        posts: updatedPosts
                    }
                }
            };
        });
    }
}))