import { useMutator } from "@api/api";
import { RegisterComponent } from "@src/organisms/registerComponent";
import { loginSelector, useAuthStore } from "@stores/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export type RegisterPassBody = {
    email: string;
    pass: string;
    user_name: string;
}

export const RegisterPage = () => {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [username, setUsername] = useState<string>('')


    const { mutateAsync: enterPassMutation, isError, error, isPending } = useMutator<RegisterPassBody>("/auth/register")
    const login = useAuthStore(loginSelector);
    const navigate = useNavigate();


    const handleRegister = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        const body = { email, pass: password, user_name: username }
        const tryLogin = await enterPassMutation(body)
        await login(email, tryLogin).catch(() => { console.log('Error saving tokens') });
        navigate('/')
    }
    
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }
    
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    return (
        <div>
            <RegisterComponent 
                onSubmit={handleRegister}
                onEmailChange={handleEmailChange}
                onPasswordChange={handlePasswordChange}
                onUsernameChange={handleUsernameChange}
                email={email}
                password={password}
                username={username}
                isError={isError} 
                error={error}
                isPending={isPending}
            
            />
        </div>
    )
}