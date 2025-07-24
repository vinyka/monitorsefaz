
import React from 'react';
import { ExclamationTriangleIcon, RefreshIcon } from './Icons';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
    return (
        <div role="alert" className="bg-red-50 dark:bg-red-900/20 border-l-4 border-status-red text-status-red p-4 rounded-r-lg my-8 mx-auto max-w-2xl">
            <div className="flex">
                <div className="py-1">
                    <ExclamationTriangleIcon className="h-6 w-6 mr-4" />
                </div>
                <div>
                    <p className="font-bold">Ocorreu um Erro</p>
                    <p className="text-sm">{message}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-3 flex items-center justify-center text-sm font-semibold text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
                        >
                            <RefreshIcon className="h-4 w-4 mr-2"/>
                            Tentar Novamente
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorMessage;
