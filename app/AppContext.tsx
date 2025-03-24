'use client';

import React from 'react';

interface AppContextProps {
    snakeOpen: boolean;
    setSnakeOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = React.createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [snakeOpen, setSnakeOpen] = React.useState<boolean>(false);

    return (
        <AppContext.Provider value={{
            snakeOpen,
            setSnakeOpen
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};