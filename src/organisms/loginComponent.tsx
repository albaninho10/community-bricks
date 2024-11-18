import { Text } from "@src/atoms/text"
import { LoginForm } from "@src/molecules/loginForm"

interface FormProps {
    email: string;
    password: string;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isError: boolean;
    error: any;
    isPending: boolean
}

export const LoginComponent: React.FC<FormProps> = ({ onSubmit, email, password, onEmailChange, onPasswordChange, isError, error, isPending }) => {
    return (
        <div>
            <Text color="black" size="large" weight="bold">Login</Text>
            <LoginForm onEmailChange={onEmailChange} onPasswordChange={onPasswordChange} onSubmit={onSubmit} email={email} password={password} isError={isError} error={error} isPending={isPending} />
        </div>
    )
}