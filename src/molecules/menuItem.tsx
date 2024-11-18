import { MenuBlock } from "@src/atoms/menuIBlock"
import { Text } from "@src/atoms/text"

interface MenuItemProps {
    text: string
    onClick?: () => void
    redirectTo?: string
}

export const MenuItem = ({text, onClick, redirectTo}: MenuItemProps) => {
    return (
        <MenuBlock onClick={onClick} redirectTo={redirectTo}>
            <Text weight="bold">{text}</Text>
        </MenuBlock>
    )
}