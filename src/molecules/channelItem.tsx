import { ChannelLink } from "@src/atoms/channels"
import { Text } from "@src/atoms/text"

export const ChannelItem = ({id, name} : {id: number, name: string}) => {
    return (
        <ChannelLink id={id}>
            <Text color="black" size="small" weight="normal">{name}</Text>
        </ChannelLink>
    )   
}