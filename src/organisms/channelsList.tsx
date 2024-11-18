import { Text } from "@src/atoms/text"
import { ChannelItem } from "@src/molecules/channelItem"

interface fakeDataItem {
    name : string,
    id : number
}

export const ChannelsList = ({ data } : { data: fakeDataItem[] }) => {
    return (
        <div className="w-full flex flex-col items-start justify-start gap-3">
            <Text color="red-600" size="large" weight="bold">Les channels de cette communauté</Text>
            {
                data.map((item, index) => (
                    <ChannelItem id={item.id} name={item.name} key={index} />
                ))
            }
        </div>
    )
}