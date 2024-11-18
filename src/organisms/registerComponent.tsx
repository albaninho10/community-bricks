import { Text } from "@src/atoms/text"
import { RegisterForm } from "@src/molecules/registerForm";

interface FormProps {
    email: string;
    password: string;
    username: string;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isError: boolean;
    error: any;
    isPending: boolean
}

export const RegisterComponent: React.FC<FormProps> = ({ onSubmit, email, password, username, onEmailChange, onPasswordChange, onUsernameChange, isError, error, isPending }) => {
    return (
        <div>
            <Text color="black" size="large" weight="bold">Login</Text>
            <RegisterForm onEmailChange={onEmailChange} onPasswordChange={onPasswordChange} onUsernameChange={onUsernameChange} onSubmit={onSubmit} email={email} password={password} username={username} isError={isError} error={error} isPending={isPending} />
        </div>
    )
}