'use client';

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { lightTheme, darkTheme } from '@/theme/theme';

const QueryContext = new QueryClient();

interface ColorModeContextType {
    toggleColorMode: () => void;
    mode: 'light' | 'dark';
}

const ColorModeContext = createContext<ColorModeContextType>({
    toggleColorMode: () => { },
    mode: 'light',
});

export const useColorMode = () => useContext(ColorModeContext);

export default function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [mode, setMode] = useState<'light' | 'dark'>('light');

    // Load theme from local storage after component mounts
    useEffect(() => {
        setMounted(true);
        const savedMode = localStorage.getItem('themeMode');
        if (savedMode) {
            setMode(savedMode as 'light' | 'dark');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setMode('dark');
        }
    }, []);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('themeMode', newMode);
                    return newMode;
                });
            },
            mode,
        }),
        [mode],
    );

    const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

    // Prevent flash of wrong theme during hydration
    if (!mounted) {
        return null;
    }

    return (
        <QueryClientProvider client={QueryContext}>
            <AppRouterCacheProvider>
                <ColorModeContext.Provider value={colorMode}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </ThemeProvider>
                </ColorModeContext.Provider>
            </AppRouterCacheProvider>
        </QueryClientProvider>
    );
}
