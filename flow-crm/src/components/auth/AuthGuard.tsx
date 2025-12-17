'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CircularProgress, Box } from '@mui/material';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Run this check on mount and when path changes
        const token = localStorage.getItem('token');
        const isLoginPage = pathname === '/login' || pathname === '/register';

        if (!token) {
            if (!isLoginPage) {
                // Not logged in, redirect to login
                setAuthorized(false);
                router.push('/login');
            } else {
                // Not logged in but already on public page, allow
                setAuthorized(true);
            }
        } else {
            if (isLoginPage) {
                // Logged in but trying to access login page, redirect to dashboard
                router.push('/dashboard');
            } else {
                // Logged in and accessing protected page, allow
                setAuthorized(true);
            }
        }
    }, [pathname, router]);

    // Show loading while checking auth state 
    // (though for localStorage it's instant, getting the router to push takes a tick)
    if (!authorized && pathname !== '/login' && pathname !== '/register') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return <>{children}</>;
}
