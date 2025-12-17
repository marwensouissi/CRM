'use client';

import React from 'react';
import { Box, Button, Typography, Stack, Grid, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '@/components/common/DataTable';
import PageWrapper from '@/components/common/PageWrapper';

import { useQuery } from '@tanstack/react-query';
import { dealService } from '@/services/dealService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const columns: GridColDef[] = [
    { field: 'title', headerName: 'Deal Name', width: 280 },
    {
        field: 'value',
        headerName: 'Value',
        width: 150,
        renderCell: (params) => (
            <Box fontWeight={600}>
                ${Number(params.value).toLocaleString()}
            </Box>
        )
    },
    {
        field: 'stage',
        headerName: 'Stage',
        width: 180,
        renderCell: (params) => {
            const getColor = (stage: string) => {
                switch (stage) {
                    case 'CLOSED_WON': return 'success.main';
                    case 'CLOSED_LOST': return 'error.main';
                    case 'NEGOTIATION': return 'warning.main';
                    default: return 'primary.main';
                }
            };
            return (
                <Box sx={{
                    color: getColor(params.value),
                    fontWeight: 600,
                    textTransform: 'capitalize'
                }}>
                    {params.value.replace('_', ' ')}
                </Box>
            );
        }
    },
    {
        field: 'probability',
        headerName: 'Probability',
        width: 120,
        renderCell: (params) => `${params.value}%`
    },
    { field: 'expected_close_date', headerName: 'Expected Close', width: 150 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const DealsPage = () => {
    const router = useRouter();
    const { data: deals, isLoading } = useQuery({
        queryKey: ['deals'],
        queryFn: dealService.getAll
    });

    const stats = React.useMemo(() => {
        if (!deals) return { total: 0, value: 0, wonValue: 0 };
        return {
            total: deals.length,
            value: deals.reduce((sum, d) => sum + Number(d.value), 0),
            wonValue: deals.filter(d => d.stage === 'CLOSED_WON').reduce((sum, d) => sum + Number(d.value), 0)
        };
    }, [deals]);

    const chartData = React.useMemo(() => {
        if (!deals) return [];
        const counts: Record<string, number> = {};
        deals.forEach(d => {
            const key = d.stage.replace(/_/g, ' ');
            counts[key] = (counts[key] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [deals]);

    return (
        <PageWrapper>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Deals</Typography>
                    <Typography variant="body1" color="text.secondary">Track your sales opportunities.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => router.push('/deals/new')}>
                    Add Deal
                </Button>
            </Stack>

            {/* Stats and Charts Section */}
            {!isLoading && deals && deals.length > 0 && (
                <Grid container spacing={3} mb={4}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={2}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary">Total Pipeline Value</Typography>
                                <Typography variant="h4" fontWeight={700} color="primary.main">
                                    ${stats.value.toLocaleString()}
                                </Typography>
                            </Paper>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary">Won Revenue</Typography>
                                <Typography variant="h4" fontWeight={700} color="success.main">
                                    ${stats.wonValue.toLocaleString()}
                                </Typography>
                            </Paper>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary">Total Deals</Typography>
                                <Typography variant="h4" fontWeight={700}>
                                    {stats.total}
                                </Typography>
                            </Paper>
                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper sx={{ p: 3, height: '100%', minHeight: 300 }}>
                            <Typography variant="h6" mb={2}>Deals by Stage</Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        label
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            <DataTable
                rows={deals || []}
                columns={columns}
                loading={isLoading}
                onRowClick={(params) => router.push(`/deals/${params.id}`)} // Make rows clickable too
            />
        </PageWrapper>
    );
};

export default DealsPage;
