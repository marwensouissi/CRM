'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
    palette: {
        mode,
        primary: {
            main: '#2563eb', // Blue-600
        },
        secondary: {
            main: '#7c3aed', // Violet-600
        },
        background: {
            default: mode === 'light' ? '#f3f4f6' : '#111827', // Gray-100 : Gray-900
            paper: mode === 'light' ? '#ffffff' : '#1f2937', // White : Gray-800
        },
        text: {
            primary: mode === 'light' ? '#111827' : '#f9fafb',
            secondary: mode === 'light' ? '#4b5563' : '#9ca3af',
        },
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
        h1: { fontSize: '2.5rem', fontWeight: 700 },
        h2: { fontSize: '2rem', fontWeight: 600 },
        h3: { fontSize: '1.75rem', fontWeight: 600 },
        h4: { fontSize: '1.5rem', fontWeight: 500 },
        h5: { fontSize: '1.25rem', fontWeight: 500 },
        h6: { fontSize: '1rem', fontWeight: 500 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: mode === 'light'
                        ? '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        : '0px 4px 6px -1px rgba(0, 0, 0, 0.5), 0px 2px 4px -1px rgba(0, 0, 0, 0.3)',
                },
            },
        },
    },
});

export const lightTheme = createTheme(getDesignTokens('light'));
export const darkTheme = createTheme(getDesignTokens('dark'));
