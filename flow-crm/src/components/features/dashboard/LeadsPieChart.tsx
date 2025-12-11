'use client';

import React from 'react';
import { Card, CardContent, Typography, useTheme, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Website', value: 400 },
    { name: 'Referral', value: 300 },
    { name: 'Social', value: 300 },
    { name: 'Ads', value: 200 },
];

const COLORS = ['#2563eb', '#7c3aed', '#ec4899', '#f59e0b'];

const LeadsPieChart = () => {
    const theme = useTheme();

    return (
        <Card sx={{ height: '100%', minHeight: 400 }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Lead Source
                </Typography>
                <Box sx={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: theme.palette.background.paper,
                                    borderRadius: 8,
                                    border: `1px solid ${theme.palette.divider}`
                                }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

export default LeadsPieChart;
