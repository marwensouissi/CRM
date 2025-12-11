'use client';

import React from 'react';
import { Box, Button, Typography, Stack, MenuItem, TextField } from '@mui/material';
import { Add, ViewModule, ViewList } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '@/components/common/DataTable';
import PageWrapper from '@/components/common/PageWrapper';

import { useQuery } from '@tanstack/react-query';
import { leadService } from '@/services/leadService';

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'company', headerName: 'Company', width: 200 },
    {
        field: 'status',
        headerName: 'Status',
        width: 150,
        renderCell: (params) => (
            <Box
                sx={{
                    color:
                        params.value === 'WON' ? 'success.main' :
                            params.value === 'LOST' ? 'error.main' :
                                params.value === 'NEW' ? 'info.main' : 'warning.main',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                }}
            >
                {params.value}
            </Box>
        )
    },
    {
        field: 'value',
        headerName: 'Value',
        width: 130,
        valueFormatter: (value: number) =>
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    },
    {
        field: 'assigned_user',
        headerName: 'Assigned To',
        width: 160,
        valueGetter: (value: any, row: any) => row.assigned_user?.name || 'Unassigned'
    },
];

const LeadsPage = () => {
    const router = useRouter();

    const { data: leads, isLoading, error } = useQuery({
        queryKey: ['leads'],
        queryFn: leadService.getAll
    });

    return (
        <PageWrapper>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Leads</Typography>
                    <Typography variant="body1" color="text.secondary">Manage your sales pipeline.</Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<ViewModule />} onClick={() => router.push('/leads/kanban')}>
                        Kanban
                    </Button>
                    <Button variant="contained" startIcon={<Add />} onClick={() => router.push('/leads/new')}>
                        Add Lead
                    </Button>
                </Stack>
            </Stack>

            <Box sx={{ mb: 3 }}>
                <TextField
                    size="small"
                    placeholder="Search leads..."
                    sx={{ width: 300, bgcolor: 'background.paper' }}
                />
            </Box>

            <DataTable
                rows={leads || []}
                columns={columns}
                loading={isLoading}
            />
        </PageWrapper>
    );
};

export default LeadsPage;
