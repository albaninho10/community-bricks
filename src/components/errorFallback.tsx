export const ErrorFallback = ({ error, resetErrorBoundary } : any) => {
    return (
        <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-red-600">Something went wrong!</h1>
            <p className="text-gray-500 mt-4">Error: {error.message}</p>
            <button
                onClick={resetErrorBoundary}
                className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
                Try Again
            </button>
        </div>
    )
}