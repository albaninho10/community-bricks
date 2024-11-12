import { 
    HomePage,
} from "@pages";


export enum PublicRoutes {
    login = '/login',
}

export enum ProtectedRoutes {
    home = '/',
}

export const Routes = {
    ...PublicRoutes,
    ...ProtectedRoutes
} as const;

export const useAppRoutes = () => {

    return {
        config: [
            { path: Routes.login, element: <HomePage /> },
            { path: Routes.home, element: <HomePage /> },
        ],
    };
}