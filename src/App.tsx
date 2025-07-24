
import React, { useState, useEffect, useCallback } from 'react';
import { ServiceType, SefazStatus } from './types';
import { SERVICE_TYPES } from './constants';
import { fetchStatusData } from './services/fiscalStatusService';
import Header from './components/Header';
import ServiceTabs from './components/ServiceTabs';
import StatusDashboard from './components/StatusDashboard';
import ServiceDetailModal from './components/ServiceDetailModal';
import ConfigurationError from './components/ConfigurationError';

const App: React.FC = () => {
    // A chave da API é um requisito para a aplicação funcionar.
    // Se não estiver presente como uma variável de ambiente, exibe uma tela de erro.
    if (!process.env.API_KEY) {
        return <ConfigurationError />;
    }

    const [activeService, setActiveService] = useState<ServiceType>(ServiceType.NFe);
    const [serviceDataCache, setServiceDataCache] = useState<Partial<Record<ServiceType, SefazStatus[]>>>({});
    const [currentData, setCurrentData] = useState<SefazStatus[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [selectedSefaz, setSelectedSefaz] = useState<SefazStatus | null>(null);


    const loadData = useCallback(async (service: ServiceType, forceRefresh: boolean = false) => {
        if (serviceDataCache[service] && !forceRefresh) {
            setCurrentData(serviceDataCache[service]!);
            setLastUpdated(new Date());
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await fetchStatusData(service);
            setServiceDataCache(prevCache => ({ ...prevCache, [service]: data }));
            setCurrentData(data);
            setLastUpdated(new Date());
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
            setError(errorMessage);
            setCurrentData(null);
        } finally {
            setLoading(false);
        }
    }, [serviceDataCache]);
    
    useEffect(() => {
        loadData(activeService);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeService]);

    useEffect(() => {
        const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;
        const intervalId = setInterval(() => {
            loadData(activeService, true);
        }, FIVE_MINUTES_IN_MS);

        return () => clearInterval(intervalId);
    }, [activeService, loadData]);

    const handleRefresh = () => {
        loadData(activeService, true);
    }

    const handleSelectSefaz = (sefaz: SefazStatus) => {
        setSelectedSefaz(sefaz);
    };

    const handleCloseDetail = () => {
        setSelectedSefaz(null);
    };

    return (
        <div className="min-h-screen bg-gray-light dark:bg-gray-900 text-gray-dark dark:text-gray-light font-sans transition-colors duration-300">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <ServiceTabs 
                    services={SERVICE_TYPES}
                    activeService={activeService}
                    setActiveService={setActiveService}
                />
                <div className="mt-6">
                    <StatusDashboard 
                        data={currentData}
                        loading={loading}
                        error={error}
                        lastUpdated={lastUpdated}
                        onRefresh={handleRefresh}
                        serviceName={activeService}
                        onSefazSelect={handleSelectSefaz}
                    />
                </div>
            </main>
            {selectedSefaz && (
                <ServiceDetailModal
                    statusData={selectedSefaz}
                    onClose={handleCloseDetail}
                />
            )}
        </div>
    );
};

export default App;
