import { useMutator } from "@api/api";
import { LoginComponent } from "@src/organisms/loginComponent";
import { loginSelector, useAuthStore } from "@stores/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export type LoginPassBody = {
    email: string;
    pass: string;
}

export const LoginPage = () => {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const { mutateAsync: enterPassMutation, isError, error, isPending } = useMutator<LoginPassBody>("/auth/login")
    const login = useAuthStore(loginSelector);
    const navigate = useNavigate();

    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        const body = { email, pass: password }
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


    return (
        <div>
            <LoginComponent
                onSubmit={handleLogin}
                onEmailChange={handleEmailChange}
                onPasswordChange={handlePasswordChange}
                email={email}
                password={password}
                isError={isError} 
                error={error}
                isPending={isPending}
            />
        </div>
    )
}