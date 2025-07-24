
import React, { useEffect, useMemo } from 'react';
import { SefazStatus, Status } from '../types';
import StatusIndicator from './StatusIndicator';
import { XMarkIcon, ClockIcon } from './Icons';

interface ServiceDetailModalProps {
    statusData: SefazStatus;
    onClose: () => void;
}

const statusColors: Record<Status, string> = {
    [Status.Disponivel]: 'bg-status-green',
    [Status.Instavel]: 'bg-status-yellow',
    [Status.Indisponivel]: 'bg-status-red',
    [Status.Contingencia]: 'bg-status-blue',
};

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ statusData, onClose }) => {
    const { autorizador, status, ultimaVerificacao, history = [] } = statusData;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const uptimePercentage = useMemo(() => {
        if (!history || history.length === 0) return 100;
        const availableCount = history.filter(h => h.status === Status.Disponivel).length;
        return ((availableCount / history.length) * 100).toFixed(1);
    }, [history]);

    const formattedLastCheck = new Date(ultimaVerificacao).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'medium'
    });

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-detail-title"
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg relative max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 id="service-detail-title" className="text-lg font-bold text-gray-800 dark:text-white">
                        Detalhes de: {autorizador}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Fechar modal"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    {/* Current Status & Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gray-light dark:bg-gray-700/50 p-4 rounded-lg">
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Status Atual</h3>
                            <StatusIndicator status={status} />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                               <ClockIcon className="h-3 w-3 mr-1.5"/> Verificado em: {formattedLastCheck}
                            </p>
                        </div>
                        <div className="bg-gray-light dark:bg-gray-700/50 p-4 rounded-lg">
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Uptime (24h)</h3>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{uptimePercentage}%</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Baseado no histórico recente</p>
                        </div>
                    </div>

                    {/* History */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">Histórico de Verificações</h3>
                        <ul className="space-y-3">
                            {history.map((item, index) => (
                                <li key={index} className="flex items-center space-x-3 text-sm">
                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${statusColors[item.status]}`} title={item.status}></div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300 w-28">{item.status}</span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {new Date(item.timestamp).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailModal;