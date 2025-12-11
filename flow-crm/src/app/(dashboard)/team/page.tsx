'use client';

import React from 'react';
import { Box, Button, Typography, Stack, Avatar } from '@mui/material';
import { Add } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '@/components/common/DataTable';
import PageWrapper from '@/components/common/PageWrapper';

const rows = [
    { id: 1, name: 'Alice Smith', email: 'alice@flowcrm.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Bob Johnson', email: 'bob@flowcrm.com', role: 'Sales Rep', status: 'Active' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@flowcrm.com', role: 'Manager', status: 'Active' },
];

const columns: GridColDef[] = [
    {
        field: 'avatar',
        headerName: '',
        width: 60,
        renderCell: (params) => <Avatar>{params.row.name.charAt(0)}</Avatar>,
        sortable: false
    },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'role', headerName: 'Role', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
];

const TeamPage = () => {
    return (
        <PageWrapper>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Team</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />}>
                    Add Member
                </Button>
            </Stack>

            <DataTable
                rows={rows}
                columns={columns}
            />
        </PageWrapper>
    );
};

export default TeamPage;
