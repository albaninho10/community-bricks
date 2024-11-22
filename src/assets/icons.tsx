import type { IconProps as IconSaxProps } from "iconsax-react";
import * as Icons from "iconsax-react";


// https://iconsax-react.pages.dev/
export type IconSvgKeys = keyof typeof Icons;

export const Icon = ({ type, color, size, ...props }: any) => {
    // @ts-ignore
    const Comp: React.ComponentType<IconSaxProps> = Icons[type];
    if (!Comp) return null;
    return (
        <Comp color={color} size={size} {...props} />
    );
};
