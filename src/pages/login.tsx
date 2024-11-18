import { useMutator } from "@api/api";
import { loginSelector, useAuthStore } from "@stores/auth";
import { useNavigate } from "react-router-dom";
import { BaseFormData, Form } from "@src/organisms/form";
import { InternalLink } from "@src/atoms/internalLink";
import { Text } from "@src/atoms/text";

interface LoginFormData extends BaseFormData {
  email: string;
  pass: string;
}

const loginFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email' as const,
    placeholder: 'votre@email.com',
    required: true,
    validation: (value: string) => {
      if (!value) return 'Email requis';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Format email invalide';
      }
    }
  },
  {
    name: 'pass',
    label: 'Mot de passe',
    type: 'password' as const,
    required: true,
    validation: (value: string) => {
      if (!value) return 'Mot de passe requis';
      if (value.length < 2) {
        return 'Le mot de passe doit contenir au moins 8 caractères';
      }
    }
  }
];

export const LoginPage = () => {

  const navigate = useNavigate();
  const login = useAuthStore(loginSelector);
  const { 
    mutateAsync: enterPassMutation, 
    isError, 
    error, 
    isPending 
  } = useMutator<LoginFormData>("/auth/login");

  const onSubmit = async (formData: LoginFormData) => {
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
      <h1 className="text-2xl font-bold mb-6">Connexion</h1>
      <Form<LoginFormData>
        fields={loginFields}
        onSubmit={onSubmit}
        submitText="Se connecter"
        isLoading={isPending}
        serverError={(error as any)?.response?.data?.error || isError ? "Une erreur est survenue" : undefined}
      />
      <InternalLink destination="/register" className="block text-center mt-4 text-blue-500">
        <Text size="medium">Créer un compte</Text>
      </InternalLink>
    </div>
  );
};