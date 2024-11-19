import {
    HomePage,
    LoginPage,
    RegisterPage,
    ChannelPage
} from "@pages";
import {
    AuthLayout
} from "@layouts";


export enum PublicRoutes {
    login = '/login',
    register = '/register',
}

export enum ProtectedRoutes {
    authLayout = '/*',
    home = '',
    test = 'test',
    channelId = ':channelId'
}

export const Routes = {
    ...PublicRoutes,
    ...ProtectedRoutes
} as const;

export const useAppRoutes = () => {

    return {
        config: [
            { path: Routes.login, element: <LoginPage /> },
            { path: Routes.register, element: <RegisterPage /> },
            {
                path: Routes.authLayout,
                element: <AuthLayout />,
                children: [
                    { path: Routes.home, element: <HomePage /> },
                    { path: Routes.test, element: <HomePage /> },
                    { path: Routes.channelId, element: <ChannelPage />},
                ]
            },

        ],
    };
}