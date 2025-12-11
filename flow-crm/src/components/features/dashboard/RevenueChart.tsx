'use client';

import React from 'react';
import { Card, CardContent, Typography, useTheme, Box } from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const data = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
];

interface RevenueChartProps {
    timeRange?: string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ timeRange = 'This Week' }) => {
    const theme = useTheme();

    return (
        <Card sx={{ height: '100%', minHeight: 400 }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Revenue Overview
                </Typography>
                <Box sx={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 8
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke={theme.palette.primary.main}
                                strokeWidth={3}
                                dot={{ r: 4, fill: theme.palette.primary.main, strokeWidth: 2, stroke: theme.palette.background.default }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

export default RevenueChart;
