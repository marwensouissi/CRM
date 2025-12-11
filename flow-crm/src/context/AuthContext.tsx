'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, authService } from '@/services/authService';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/axios';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: Record<string, unknown>) => Promise<void>;
    register: (data: Record<string, unknown>) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Check for token and fetch user on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Temporarily just restore user from local storage if API fails or verify token
                    // For proper flow, we calls /api/user. 
                    // Let's rely on api interceptor to send token.
                    const userData = await authService.getUser();
                    setUser(userData);
                } catch (error) {
                    console.error('Auth check failed', error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (credentials: Record<string, unknown>) => {
        try {
            const data = await authService.login(credentials);
            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
                setUser(data.user);
                router.push('/dashboard');
            }
        } catch (error) {
            throw error;
        }
    };

    const register = async (data: Record<string, unknown>) => {
        try {
            const res = await authService.register(data);
            if (res.access_token) {
                localStorage.setItem('token', res.access_token);
                setUser(res.user);
                router.push('/dashboard');
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            router.push('/login');
        }
    };

    // Protect routes
    useEffect(() => {
        const publicRoutes = ['/login', '/register', '/forgot-password', '/'];
        if (!isLoading && !user && !publicRoutes.includes(pathname)) {
            // router.push('/login'); // Uncomment to enforce protection
        }
    }, [user, isLoading, pathname, router]);

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
