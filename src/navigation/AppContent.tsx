import { ErrorFallback } from '@components/errorFallback';
import { Router } from '@navigation/router';
import { ErrorBoundary } from 'react-error-boundary';

export const AppContent = () => {

    function logErrorToService(error:any, errorInfo:any) {
        console.error("Logging to error service: ", { error, errorInfo });
    }

    return (
        <>
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={(error, errorInfo) => logErrorToService(error, errorInfo)}
            >
                <Router />
            </ErrorBoundary>
        </>
    );
};

