import { Link } from "react-router-dom"

export const ChannelLink = ({children, id} : { children: React.ReactNode, id: number}) => {
    return (
        <Link to={`/${id}`} className="w-full border border-black rounded-md py-2 px-4 cursor-pointer">
            {children}
        </Link>
    )
}