'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, IconProps, Stack, useTheme } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface KPICardProps {
    title: string;
    value: string;
    change: number; // percentage
    icon: React.ReactNode;
    color?: string;
    delay?: number;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, color = 'primary.main', delay = 0 }) => {
    const theme = useTheme();
    const isPositive = change >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
        >
            <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                            <Typography color="text.secondary" variant="subtitle2" fontWeight={600} gutterBottom>
                                {title}
                            </Typography>
                            <Typography variant="h4" fontWeight={700} color="text.primary">
                                {value}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 3,
                                backgroundColor: (theme) =>  // Transparent background based on color
                                    color.startsWith('#') ? `${color}20` : `${theme.palette.primary.main}20`,
                                color: color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {icon}
                        </Box>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: isPositive ? 'success.main' : 'error.main',
                                bgcolor: isPositive ? 'success.grey' : 'error.grey',
                                borderRadius: 1,
                                px: 0.5,
                                py: 0.25,
                                bgOpacity: 0.2 // This needs proper alpha handling, using simplified approach
                            }}
                        >
                            {isPositive ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                            <Typography variant="caption" fontWeight={700} sx={{ ml: 0.5 }}>
                                {Math.abs(change)}%
                            </Typography>
                        </Box>
                        <Typography variant="caption" color="text.third">
                            vs last month
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default KPICard;
