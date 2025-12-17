'use client';

import React from 'react';
import { Box, Button, Typography, Stack, Avatar, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '@/components/common/DataTable';
import PageWrapper from '@/components/common/PageWrapper';
import { useQuery } from '@tanstack/react-query';
import { teamService } from '@/services/teamService';
import { useRouter } from 'next/navigation';

const TeamPage = () => {
    const router = useRouter();
    const { data: users, isLoading } = useQuery({
        queryKey: ['team'],
        queryFn: teamService.getAll
    });

    const columns: GridColDef[] = [
        {
            field: 'avatar',
            headerName: '',
            width: 60,
            renderCell: (params) => {
                const name = params.row.name || 'Unknown';
                const initial = name.charAt(0).toUpperCase();
                return <Avatar alt={name}>{initial}</Avatar>;
            },
            sortable: false
        },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 250 },
        {
            field: 'role',
            headerName: 'Role',
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    color={params.value === 'ADMIN' ? 'error' : params.value === 'MANAGER' ? 'warning' : 'default'}
                />
            )
        },
        { field: 'title', headerName: 'Title', width: 200 },
        {
            field: 'deals_count',
            headerName: 'Deals',
            width: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Typography fontWeight="bold" color="primary">{params.value || 0}</Typography>
            )
        },
    ];

    return (
        <PageWrapper>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Team</Typography>
                    <Typography variant="body1" color="text.secondary">Manage your team members and view performance.</Typography>
                </Box>
                {/* 
                <Button variant="contained" startIcon={<Add />}>
                    Add Member
                </Button>
                */}
            </Stack>

            <DataTable
                rows={users || []}
                columns={columns}
                loading={isLoading}
                onRowClick={(id) => router.push(`/team/${id}`)}
                sx={{ cursor: 'pointer' }}
            />
        </PageWrapper>
    );
};

export default TeamPage;
