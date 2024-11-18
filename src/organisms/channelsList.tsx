import { MenuBlockSkeleton } from "@src/atoms/menuIBlock"
import { MenuItem } from "@src/molecules/menuItem"

interface DataItem {
    name: string,
    id: number
}

interface ChannelsListProps {
    isLoading: boolean
    data: DataItem[]
}

export const ChannelsList = ({ data, isLoading }: ChannelsListProps) => {
    return (
        <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex flex-row items-center justify-start gap-3 min-w-min">
                {
                    isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <MenuBlockSkeleton key={index} />
                        ))
                    ) : (
                        data.map((item, index) => (
                            <MenuItem key={index} text={item.name} redirectTo={`/${item.id}`} />
                        ))
                    )
                }
            </div>
        </div>
    )
}