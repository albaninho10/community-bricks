import { MenuBlockSkeleton } from "@src/atoms/menuIBlock"
import { PostItem } from "@src/molecules/postItem"
import { Message } from "@interfaces/community"

interface PostsListProps {
    isLoading: boolean
    data: Message[]
}

export const PostsList = ({ data, isLoading }: PostsListProps) => {
    return (
        <div className="w-full">
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
                            content={item}
                        />
                    ))
                )
            }
        </div>
    )
}