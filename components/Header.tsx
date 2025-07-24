import React from 'react';
import { SignalIcon } from './Icons';

const Header: React.FC = () => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 py-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <SignalIcon className="h-8 w-8 text-brand-primary dark:text-brand-secondary" />
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                        Monitor SEFAZ DataMix
                    </h1>
                </div>
            </div>
        </header>
    );
};

export default Header;