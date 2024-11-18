import { Button } from '@src/atoms/button';
import { Input } from '@src/atoms/input';
import { Text } from '@src/atoms/text';

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


export const RegisterForm: React.FC<FormProps> = ({ onSubmit, email, password, username, onEmailChange, onPasswordChange, onUsernameChange, isError, error, isPending }) => {

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
        <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={onEmailChange}
            className="w-full"
        />
        <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={onUsernameChange}
            className="w-full"
        />
        <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={onPasswordChange}
            className="w-full"
        />
        {
            isError && error && (
                <div className='w-full bg-red-100 rounded-md py-2 px-4'>
                    <Text color='black' size='small'>{error?.response?.data?.error || "Une erreur est survenue"}</Text>
                </div>
            )
        }
        {
            isPending && (
                <div className='w-full bg-yellow-100 rounded-md py-2 px-4'>
                    <Text color='black' size='small'>Loading...</Text>
                </div>
            )
        }
        <Button type='submit'>Envoyer</Button>
    </form>
    );
};