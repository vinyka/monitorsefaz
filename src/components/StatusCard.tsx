
import React from 'react';
import { SefazStatus } from '../types';
import StatusIndicator from './StatusIndicator';
import { ClockIcon } from './Icons';

interface StatusCardProps {
    statusData: SefazStatus;
    onSelect: () => void;
}

const StatusCard: React.FC<StatusCardProps> = ({ statusData, onSelect }) => {
    const { uf, autorizador, status, ultimaVerificacao } = statusData;
    
    const formattedTime = new Date(ultimaVerificacao).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <button
            onClick={onSelect}
            className="w-full bg-gray-light dark:bg-gray-700 p-3 rounded-lg shadow-sm hover:shadow-md hover:ring-2 hover:ring-brand-primary/50 transition-all duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label={`Ver detalhes de ${autorizador}`}
        >
            
            {/* Main Info */}
            <div className="flex-1 flex items-center gap-4">
                <span className="text-base font-bold text-brand-primary dark:text-blue-300 w-12 h-10 flex items-center justify-center flex-shrink-0 bg-white dark:bg-gray-600 rounded-md">{uf}</span>
                <div className="flex-1">
                    <h3 className="text-md font-semibold text-gray-800 dark:text-white">{autorizador}</h3>
                    <div className="sm:hidden mt-2">
                        <StatusIndicator status={status} />
                    </div>
                </div>
            </div>

            {/* Status & Time */}
            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                <div className="hidden sm:block sm:w-40 flex-shrink-0">
                    <StatusIndicator status={status} />
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                    <ClockIcon className="h-4 w-4 mr-1.5" />
                    <span>{formattedTime}</span>
                </div>
            </div>
        </button>
    );
};

export default StatusCard;