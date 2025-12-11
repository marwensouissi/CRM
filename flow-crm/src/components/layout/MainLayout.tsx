'use client';

import React from 'react';
import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
    const { isOpen } = useSidebar();
    const theme = useTheme();

    const mainVariants = {
        open: {
            marginLeft: 280,
            width: `calc(100% - 280px)`,
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        },
        closed: {
            marginLeft: 80,
            width: `calc(100% - 80px)`,
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        },
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
            <Sidebar />
            <Navbar />
            <Box
                component={motion.main}
                initial={isOpen ? 'open' : 'closed'}
                animate={isOpen ? 'open' : 'closed'}
                variants={mainVariants}
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 8, // Toolbar height
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <LayoutContent>{children}</LayoutContent>
        </SidebarProvider>
    );
};

export default MainLayout;
