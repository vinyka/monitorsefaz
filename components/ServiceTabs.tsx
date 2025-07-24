
import React from 'react';
import { ServiceType } from '../types';

interface ServiceTabsProps {
    services: ServiceType[];
    activeService: ServiceType;
    setActiveService: (service: ServiceType) => void;
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({ services, activeService, setActiveService }) => {
    return (
        <div className="flex space-x-1 rounded-lg bg-gray-200 dark:bg-gray-700 p-1" role="tablist" aria-orientation="horizontal">
            {services.map((service) => (
                <button
                    key={service}
                    onClick={() => setActiveService(service)}
                    className={`w-full rounded-md py-2.5 text-sm font-medium leading-5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60
                    ${activeService === service 
                        ? 'bg-white dark:bg-gray-900 text-brand-primary dark:text-white shadow' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                    }`}
                    role="tab"
                    aria-selected={activeService === service}
                >
                    {service}
                </button>
            ))}
        </div>
    );
};

export default ServiceTabs;
