import { Button } from "@src/atoms/button"
import { logoutSelector, useAuthStore } from "@stores/auth"
import { useNavigate } from "react-router-dom"

export const LogoutButton = () => {

    const logout = useAuthStore(logoutSelector)
    const navigate = useNavigate()
    
    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <Button onClick={handleLogout} className="bg-red-400 hover:bg-red-500 w-full transition-all duration-300">
            Se déconnecter
        </Button>
    )
}