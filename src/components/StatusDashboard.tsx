
import React from 'react';
import { SefazStatus } from '../types';
import StatusCard from './StatusCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { RefreshIcon } from './Icons';

interface StatusDashboardProps {
    data: SefazStatus[] | null;
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null;
    onRefresh: () => void;
    serviceName: string;
    onSefazSelect: (sefaz: SefazStatus) => void;
}

const StatusDashboard: React.FC<StatusDashboardProps> = ({ data, loading, error, lastUpdated, onRefresh, serviceName, onSefazSelect }) => {
    
    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center p-16"><LoadingSpinner /></div>;
        }

        if (error) {
            return <ErrorMessage message={error} onRetry={onRefresh} />;
        }

        if (!data || data.length === 0) {
            return (
                <div className="text-center py-16 text-gray-500">
                    <p>Nenhum dado de status encontrado para {serviceName}.</p>
                    <p className="mt-2 text-sm">Tente atualizar ou selecionar outro serviço.</p>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-3">
                {data.map((status, index) => (
                    <StatusCard 
                        key={`${status.uf}-${index}`} 
                        statusData={status} 
                        onSelect={() => onSefazSelect(status)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Status dos Serviços - {serviceName}</h2>
                <div className="flex items-center space-x-4">
                    {lastUpdated && !loading && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                           Atualizado às {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                    <button 
                        onClick={onRefresh}
                        disabled={loading}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Atualizar dados"
                    >
                       <RefreshIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`}/>
                    </button>
                </div>
            </div>
            {renderContent()}
        </div>
    );
};

export default StatusDashboard;