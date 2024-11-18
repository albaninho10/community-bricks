import { useAuthStore } from "@stores/auth"
import { Navigate, Outlet } from "react-router-dom"

export const AuthLayout: React.FC<{ children?: React.ReactNode }> = () => {

    const { isLogged } = useAuthStore()
    console.log(isLogged)
    
    if(!isLogged) return <Navigate to="/login" replace />
    
    return (
        <div className="flex justify-center items-start h-screen">
            <div className="w-11/12">
                <Outlet />
            </div>
        </div>
    )
}