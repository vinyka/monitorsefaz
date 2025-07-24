
import React from 'react';
import { ExclamationTriangleIcon } from './Icons';

const ConfigurationError: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-light dark:bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-status-red" />
                <h1 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
                    Erro de Configuração
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    A aplicação não está configurada corretamente. A chave de API necessária para comunicação com o serviço de inteligência artificial não foi encontrada.
                </p>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Por favor, entre em contato com o administrador do sistema para resolver este problema.
                </p>
            </div>
        </div>
    );
};

export default ConfigurationError;
