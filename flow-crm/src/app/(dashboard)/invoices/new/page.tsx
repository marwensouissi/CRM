'use client';

import React from 'react';
import { Box, Button, Typography, TextField, Stack, Paper, MenuItem, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '@/services/invoiceService';
import { clientService } from '@/services/clientService';
import PageWrapper from '@/components/common/PageWrapper';
import { ArrowBack } from '@mui/icons-material';

const STATUSES = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'SENT', label: 'Sent' },
    { value: 'PAID', label: 'Paid' },
    { value: 'OVERDUE', label: 'Overdue' }
];

const NewInvoicePage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const { data: clients } = useQuery({
        queryKey: ['clients'],
        queryFn: clientService.getAll
    });

    const mutation = useMutation({
        mutationFn: invoiceService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            router.push('/invoices');
        }
    });

    const onSubmit = (data: any) => {
        mutation.mutate({
            ...data,
        });
    };

    return (
        <PageWrapper>
            <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                <Button startIcon={<ArrowBack />} onClick={() => router.back()}>Back</Button>
                <Typography variant="h4" fontWeight={700}>Create Invoice</Typography>
            </Stack>

            <Paper sx={{ p: 4, maxWidth: 800 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Invoice Number"
                                defaultValue={`INV-${Date.now().toString().slice(-6)}`}
                                {...register('invoice_number', { required: 'Invoice Number is required' })}
                                error={!!errors.invoice_number}
                                helperText={errors.invoice_number?.message as string}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Client"
                                defaultValue=""
                                {...register('client_id', { required: 'Client is required' })}
                                error={!!errors.client_id}
                                helperText={errors.client_id?.message as string}
                            >
                                {clients?.map((client) => (
                                    <MenuItem key={client.id} value={client.id}>
                                        {client.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Amount ($)"
                                type="number"
                                {...register('amount', { required: 'Amount is required' })}
                                error={!!errors.amount}
                                helperText={errors.amount?.message as string}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Status"
                                defaultValue="DRAFT"
                                {...register('status')}
                            >
                                {STATUSES.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Issue Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                {...register('issue_date', { required: 'Issue Date is required' })}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Due Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                {...register('due_date')}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button variant="outlined" onClick={() => router.back()}>Cancel</Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={mutation.isPending}
                                >
                                    {mutation.isPending ? 'Creating...' : 'Create Invoice'}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </PageWrapper>
    );
};

export default NewInvoicePage;
