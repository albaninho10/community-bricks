import { useMutator } from "@api/api";
import { loginSelector, useAuthStore } from "@stores/auth";
import { useNavigate } from "react-router-dom";
import { BaseFormData, Form, FormConfig } from "@src/organisms/form";
import { InternalLink } from "@src/atoms/internalLink";
import { Text } from "@src/atoms/text";

interface RegisterFormData extends BaseFormData {
    email: string;
    pass: string;
    user_name: string;
}

const registerFields: FormConfig<RegisterFormData>[] = [
    {
        name: 'email',
        label: 'Email',
        type: 'email' as const,
        placeholder: 'elon@tesla.com',
        required: true,
        validation: (value: string) => {
            if (!value) return 'Email requis';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return 'Format email invalide';
            }
        }
    },
    {
        name: 'user_name',
        label: 'Nom d\'utilisateur',
        type: 'text',
        required: true,
        placeholder: 'Elon Musk',
        validation: (value: string) => {
            if (!value) return 'Nom d\'utilisateur requis';
            return undefined;
        }
    },
    {
        name: 'pass',
        label: 'Mot de passe',
        type: 'password',
        required: true,
        placeholder: 'DODGEcoinToTheMoon',
        validation: (value: string) => {
            if (value.length < 2) {
                return 'Le mot de passe doit contenir au moins 8 caractères';
            }
        }
    }
];

export const RegisterPage = () => {

    const navigate = useNavigate();
    const login = useAuthStore(loginSelector);
    const {
        mutateAsync: enterPassMutation,
        isError,
        error,
        isPending
    } = useMutator<RegisterFormData>("/auth/register");

    const onSubmit = async (formData: RegisterFormData) => {
        try {
            const tryLogin = await enterPassMutation(formData);
            await login(formData.email, tryLogin).catch(() => {
                throw new Error('Error saving tokens');
            });
            navigate('/');
        } catch (error) {
            throw error;
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6">
            <h1 className="text-2xl font-bold mb-6">Créer un compte</h1>
            <Form<RegisterFormData>
                fields={registerFields}
                onSubmit={onSubmit}
                submitText="Se connecter"
                isLoading={isPending}
                serverError={(error as any)?.response?.data?.error || isError ? "Une erreur est survenue" : undefined}
            />
            <InternalLink destination="/login" className="block text-center mt-4 text-blue-500">
                <Text size="medium">Connexion</Text>
            </InternalLink>
        </div>
    );
};