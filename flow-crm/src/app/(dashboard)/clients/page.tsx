'use client';

import React from 'react';
import { Box, Button, Typography, Stack, TextField } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '@/components/common/DataTable';
import PageWrapper from '@/components/common/PageWrapper';

import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Client Name', width: 220 },
    { field: 'industry', headerName: 'Industry', width: 150 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    {
        field: 'total_spent',
        headerName: 'Total Spent',
        width: 150,
        renderCell: (params) => (
            <Box fontWeight={600}>
                ${Number(params.value).toLocaleString()}
            </Box>
        )
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: (params) => (
            <Box sx={{
                color: params.value === 'ACTIVE' ? 'success.main' : 'text.secondary',
                bgcolor: params.value === 'ACTIVE' ? 'success.light' : 'action.hover',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: 12,
                fontWeight: 600,
                opacity: 0.8
            }}>
                {params.value}
            </Box>
        )
    },
];

const ClientsPage = () => {
    const router = useRouter();
    const { data: clients, isLoading } = useQuery({
        queryKey: ['clients'],
        queryFn: clientService.getAll
    });

    return (
        <PageWrapper>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Clients</Typography>
                    <Typography variant="body1" color="text.secondary">Manage your client relationships.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => router.push('/clients/new')}>
                    Add Client
                </Button>
            </Stack>

            <Box sx={{ mb: 3 }}>
                <TextField
                    size="small"
                    placeholder="Search clients..."
                    sx={{ width: 300, bgcolor: 'background.paper' }}
                />
            </Box>

            <DataTable
                rows={clients || []}
                columns={columns}
                loading={isLoading}
            />
        </PageWrapper>
    );
};

export default ClientsPage;
