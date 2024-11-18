import { Link as RouterLink } from 'react-router-dom';

export const InternalLink = ({ children, destination, className } : { children: React.ReactNode, destination: string, className?: string; }) => {
    return (
        <RouterLink to={`${destination}`} className={`w-max underline hover:bg-blue-200 transition ${className}`}>
            {children}
        </RouterLink>
    )
}