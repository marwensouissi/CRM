import Sidebar from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/context/SidebarContext';
import { Box } from '@mui/material';
import AuthGuard from '@/components/auth/AuthGuard';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <SidebarProvider>
                <Box sx={{ display: 'flex' }}>
                    <Sidebar />
                    <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: '280px' }}>
                        {children}
                    </Box>
                </Box>
            </SidebarProvider>
        </AuthGuard>
    );
}
