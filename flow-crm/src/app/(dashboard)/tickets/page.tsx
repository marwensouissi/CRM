'use client';

import React from 'react';
import { Box, Button, Typography, Stack, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '@/components/common/DataTable';
import PageWrapper from '@/components/common/PageWrapper';

import { useQuery } from '@tanstack/react-query';
import { ticketService } from '@/services/ticketService';

const columns: GridColDef[] = [
    { field: 'subject', headerName: 'Subject', width: 250 },
    {
        field: 'priority',
        headerName: 'Priority',
        width: 120,
        renderCell: (params) => (
            <Box sx={{ color: params.value === 'HIGH' ? 'error.main' : 'text.primary', fontWeight: params.value === 'HIGH' ? 'bold' : 'normal' }}>
                {params.value}
            </Box>
        )
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: (params) => (
            <Chip
                label={params.value}
                size="small"
                color={params.value === 'OPEN' ? 'primary' : params.value === 'RESOLVED' ? 'success' : 'default'}
            />
        )
    },
    {
        field: 'created_at', headerName: 'Created At', width: 180,
        valueFormatter: (params: any) => new Date(params.value).toLocaleDateString()
    },
];

const TicketsPage = () => {
    const { data: tickets, isLoading } = useQuery({
        queryKey: ['tickets'],
        queryFn: ticketService.getAll
    });

    return (
        <PageWrapper>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Tickets</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />}>
                    New Ticket
                </Button>
            </Stack>

            <DataTable
                rows={tickets || []}
                columns={columns}
                loading={isLoading}
            />
        </PageWrapper>
    );
};

export default TicketsPage;
