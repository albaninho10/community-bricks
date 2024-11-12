import { BrowserRouter, useRoutes } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query'

import { useAppRoutes } from "@navigation/useAppRoutes";
import { queryClient } from "@api/queryConfig";

type CurrentRouteProps = {
    currentRoutes: RouteObject[];
};

const CurrentRoute = ({ currentRoutes }: CurrentRouteProps) => {

    const route = useRoutes(currentRoutes);

    return (
        <div className="bg-white w-full overflow-auto h-full relative">{route}</div>
    );
};

const Routes = () => {

    const { config } = useAppRoutes();

    return (
        <div className="relative w-full flex flex-1 h-webkit overflow-hidden safeAreaBottom">
            <CurrentRoute currentRoutes={config} />
        </div>
    )
}

export const Router = () => (
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <Routes />
        </QueryClientProvider>
    </BrowserRouter>
)