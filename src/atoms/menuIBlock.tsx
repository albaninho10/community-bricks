import { Link } from "react-router-dom"

interface MenuBlockProps {
    children: React.ReactNode
    onClick?: () => void
    redirectTo?: string
}

export const MenuBlock = ({children, onClick, redirectTo}: MenuBlockProps) => {
    
    if(redirectTo) {
        return (
            <Link to={redirectTo} className="w-max border border-black rounded-full py-2 px-4 cursor-pointer">
                {children}
            </Link>
        )
    }

    return (
        <div onClick={onClick} className="w-max border border-black rounded-full py-2 px-4 cursor-pointer">
            {children}
        </div>
    )
}

export const MenuBlockSkeleton = () => {
    return (
        <div className="w-max border border-gray-200 rounded-full py-3 px-5 cursor-pointer animate-pulse bg-gray-100 w-24 flex items-center justify-center">
            <div className="h-2 bg-gray-200 w-full rounded-full"></div>
        </div>
    )
}