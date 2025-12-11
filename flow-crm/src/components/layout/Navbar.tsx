'use client';

import React from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Stack,
    useTheme
} from '@mui/material';
import {
    Brightness4,
    Brightness7,
    Notifications as NotificationsIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { useColorMode } from '@/providers';
import { useSidebar } from '@/context/SidebarContext';
import { motion } from 'framer-motion';

const Navbar = () => {
    const theme = useTheme();
    const { toggleColorMode, mode } = useColorMode();
    const { isOpen } = useSidebar();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const navbarVariants = {
        open: {
            width: `calc(100% - 280px)`,
            marginLeft: '280px',
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        },
        closed: {
            width: `calc(100% - 80px)`,
            marginLeft: '80px',
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        },
    };

    return (
        <AppBar
            position="fixed"
            color="default"
            elevation={0}
            component={motion.div}
            initial={isOpen ? 'open' : 'closed'}
            animate={isOpen ? 'open' : 'closed'}
            variants={navbarVariants}
            sx={{
                backgroundColor: theme.palette.background.default,
                borderBottom: `1px solid ${theme.palette.divider}`,
                backdropFilter: 'blur(8px)',
                zIndex: 1100
            }}
        >
            <Toolbar>
                {/* Search Bar Placeholder */}
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: theme.palette.background.paper,
                            px: 2,
                            py: 0.5,
                            borderRadius: 3,
                            boxShadow: theme.shadows[1],
                            gap: 1
                        }}
                    >
                        <SearchIcon color="action" />
                        <Typography variant="body2" color="text.secondary">Search...</Typography>
                    </Box>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                    {/* Theme Toggle */}
                    <IconButton onClick={toggleColorMode} color="inherit">
                        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>

                    {/* Notifications */}
                    <IconButton color="inherit">
                        <NotificationsIcon />
                    </IconButton>

                    {/* User Profile */}
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <Avatar alt="User Name" src="/static/images/avatar/1.jpg" sx={{ width: 32, height: 32 }} />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My Account</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                    </Menu>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
