import { MenuBlockSkeleton } from "@src/atoms/menuIBlock"
import { PostItem } from "@src/molecules/postItem"
import { Message } from "@interfaces/community"

interface PostsListProps {
    isLoading: boolean
    data: Message[]
}

export const PostsList = ({ data, isLoading }: PostsListProps) => {
    return (
        <div className="w-full max-h-[500px] overflow-y-auto scrollbar-hide">
            <div className="flex flex-col items-start gap-3">
                {
                    isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <MenuBlockSkeleton key={index} />
                        ))
                    ) : (
                        data.map((item, index) => (
                            <PostItem 
                                key={index} 
                                userName={item.user_name} 
                                content={item.user_name}
                            />
                        ))
                    )
                }
            </div>
        </div>
    )
}