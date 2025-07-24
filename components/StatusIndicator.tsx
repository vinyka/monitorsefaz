
import React from 'react';
import { Status } from '../types';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon } from './Icons';

interface StatusIndicatorProps {
    status: Status;
}

const statusConfig = {
    [Status.Disponivel]: {
        text: 'Disponível',
        className: 'text-status-green',
        Icon: CheckCircleIcon
    },
    [Status.Instavel]: {
        text: 'Instável',
        className: 'text-status-yellow',
        Icon: ExclamationTriangleIcon
    },
    [Status.Indisponivel]: {
        text: 'Indisponível',
        className: 'text-status-red',
        Icon: XCircleIcon
    },
    [Status.Contingencia]: {
        text: 'Em Contingência',
        className: 'text-status-blue',
        Icon: InformationCircleIcon
    }
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
    const config = statusConfig[status] || statusConfig[Status.Indisponivel];
    const { text, className, Icon } = config;

    return (
        <div className={`flex items-center space-x-2 font-medium ${className}`}>
            <Icon className="h-5 w-5" />
            <span>{text}</span>
        </div>
    );
};

export default StatusIndicator;
