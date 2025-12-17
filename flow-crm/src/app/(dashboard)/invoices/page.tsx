'use client';

import React from 'react';
import { Box, Button, Typography, Stack, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '@/components/common/DataTable';
import PageWrapper from '@/components/common/PageWrapper';

import { useQuery } from '@tanstack/react-query';
import { invoiceService } from '@/services/invoiceService';

const columns: GridColDef[] = [
    { field: 'invoice_number', headerName: 'Invoice #', width: 150 },
    { field: 'issue_date', headerName: 'Date', width: 150 },
    {
        field: 'amount',
        headerName: 'Amount',
        width: 150,
        renderCell: (params) => `$${Number(params.value).toLocaleString()}`
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 150,
        renderCell: (params) => {
            const getColor = (status: string) => {
                switch (status) {
                    case 'PAID': return 'success';
                    case 'OVERDUE': return 'error';
                    case 'SENT': return 'primary';
                    default: return 'default';
                }
            };
            return (
                <Chip
                    label={params.value}
                    size="small"
                    color={getColor(params.value)}
                    variant="outlined"
                />
            );
        }
    },
];

const InvoicesPage = () => {
    const router = useRouter();
    const { data: invoices, isLoading } = useQuery({
        queryKey: ['invoices'],
        queryFn: invoiceService.getAll
    });

    return (
        <PageWrapper>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Invoices</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => router.push('/invoices/new')}>
                    Create Invoice
                </Button>
            </Stack>

            <DataTable
                rows={invoices || []}
                columns={columns}
                loading={isLoading}
            />
        </PageWrapper>
    );
};

export default InvoicesPage;
