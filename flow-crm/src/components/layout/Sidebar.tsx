'use client';

import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Typography,
    useTheme,
    Tooltip,
    Divider
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Contacts as ContactsIcon,
    MonetizationOn as MonetizationOnIcon,
    Task as TaskIcon,
    Description as DescriptionIcon,
    ConfirmationNumber as TicketIcon,
    Group as TeamIcon,
    Settings as SettingsIcon,
    ChevronLeft as ChevronLeftIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import { useSidebar } from '@/context/SidebarContext';

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Leads', icon: <PeopleIcon />, path: '/leads' },
    { text: 'Clients', icon: <ContactsIcon />, path: '/clients' },
    { text: 'Deals', icon: <MonetizationOnIcon />, path: '/deals' },
    { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
    { text: 'Invoices', icon: <DescriptionIcon />, path: '/invoices' },
    { text: 'Tickets', icon: <TicketIcon />, path: '/tickets' },
    { text: 'Team', icon: <TeamIcon />, path: '/team' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar = () => {
    const { isOpen, toggleSidebar } = useSidebar();
    const theme = useTheme();
    const pathname = usePathname();
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const sidebarVariants = {
        open: {
            width: 280,
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        },
        closed: {
            width: 80,
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        },
    };

    return (
        <motion.div
            initial={isOpen ? 'open' : 'closed'}
            animate={isOpen ? 'open' : 'closed'}
            variants={sidebarVariants}
            style={{
                height: '100vh',
                backgroundColor: theme.palette.background.paper,
                borderRight: `1px solid ${theme.palette.divider}`,
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1200,
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isOpen ? 'space-between' : 'center',
                    p: 2,
                    minHeight: 64
                }}
            >
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                                FlowCRM
                            </Typography>
                        </motion.div>
                    )}
                </AnimatePresence>
                <IconButton onClick={toggleSidebar}>
                    {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
            </Box>

            <Divider />

            {/* Menu Items */}
            <List sx={{ flexGrow: 1, py: 2 }}>
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.path);
                    return (
                        <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
                            <Tooltip title={!isOpen ? item.text : ''} placement="right">
                                <ListItemButton
                                    onClick={() => handleNavigation(item.path)}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: isOpen ? 'initial' : 'center',
                                        px: 2.5,
                                        mx: 1,
                                        borderRadius: 2,
                                        backgroundColor: isActive ? theme.palette.primary.main + '1A' : 'transparent', // 10% opacity equivalent
                                        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                                        '&:hover': {
                                            backgroundColor: isActive
                                                ? theme.palette.primary.main + '26'
                                                : theme.palette.action.hover,
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: isOpen ? 3 : 'auto',
                                            justifyContent: 'center',
                                            color: 'inherit',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: 'auto' }}
                                                exit={{ opacity: 0, width: 0 }}
                                            >
                                                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    );
                })}
            </List>

            {/* User / Footer Area could go here */}
        </motion.div>
    );
};

export default Sidebar;
