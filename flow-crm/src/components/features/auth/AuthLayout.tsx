'use client';

import React from 'react';
import { Box, Paper, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/common/PageWrapper';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <PageWrapper>
            <Grid container component="main" sx={{ height: '100vh', overflow: 'hidden' }}>
                {/* Left Side - Form */}
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    component={Paper}
                    elevation={6}
                    square
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4,
                        backgroundColor: theme.palette.background.default,
                        zIndex: 1,
                        boxShadow: 'none',
                        borderRight: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 450,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'start', // Align left for modern look
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Typography component="h1" variant="h4" fontWeight={700} color="primary" gutterBottom>
                                FlowCRM
                            </Typography>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{ width: '100%' }}
                        >
                            <Box mb={4}>
                                <Typography component="h2" variant="h3" fontWeight={700} gutterBottom>
                                    {title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {subtitle}
                                </Typography>
                            </Box>
                            {children}
                        </motion.div>
                    </Box>
                </Grid>

                {/* Right Side - Image/Branding */}
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random?office,work)', // Placeholder or use generated image
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: theme.palette.primary.main,
                            opacity: 0.1, // Tint
                        }}
                    />
                    {!isMobile && (
                        <Box
                            component={motion.div}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            sx={{
                                position: 'absolute',
                                bottom: 40,
                                left: 40,
                                p: 4,
                                maxWidth: 600,
                                color: '#fff',
                                zIndex: 2,
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                            }}
                        >
                            <Typography variant="h3" fontWeight="bold" gutterBottom>
                                Manage your relationships with ease.
                            </Typography>
                            <Typography variant="h6">
                                Streamline your sales process and close deals faster with our intuitive FlowCRM.
                            </Typography>

                        </Box>
                    )}
                </Grid>
            </Grid>
        </PageWrapper>
    );
};

export default AuthLayout;
