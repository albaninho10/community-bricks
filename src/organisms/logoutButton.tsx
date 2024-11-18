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
        <Button onClick={handleLogout}>
            Se déconnecter
        </Button>
    )
}