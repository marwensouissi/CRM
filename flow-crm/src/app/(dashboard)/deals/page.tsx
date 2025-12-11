'use client';

import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '@/components/common/DataTable';
import PageWrapper from '@/components/common/PageWrapper';

import { useQuery } from '@tanstack/react-query';
import { dealService } from '@/services/dealService';

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

const DealsPage = () => {
    const router = useRouter();
    const { data: deals, isLoading } = useQuery({
        queryKey: ['deals'],
        queryFn: dealService.getAll
    });

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

            <DataTable
                rows={deals || []}
                columns={columns}
                loading={isLoading}
            />
        </PageWrapper>
    );
};

export default DealsPage;
