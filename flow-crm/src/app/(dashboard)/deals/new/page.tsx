'use client';

import React from 'react';
import { Box, Button, Typography, TextField, Stack, Paper, MenuItem, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dealService } from '@/services/dealService';
import { clientService } from '@/services/clientService';
import PageWrapper from '@/components/common/PageWrapper';
import { ArrowBack } from '@mui/icons-material';

const STAGES = [
    { value: 'LEAD', label: 'Lead' },
    { value: 'APPOINTMENT_SCHEDULED', label: 'Appointment Scheduled' },
    { value: 'QUALIFIED_TO_BUY', label: 'Qualified to Buy' },
    { value: 'PRESENTATION_SCHEDULED', label: 'Presentation Scheduled' },
    { value: 'DECISION_MAKER_BOUGHT_IN', label: 'Decision Maker Bought-In' },
    { value: 'CONTRACT_SENT', label: 'Contract Sent' },
    { value: 'CLOSED_WON', label: 'Closed Won' },
    { value: 'CLOSED_LOST', label: 'Closed Lost' },
];

const NewDealPage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const { data: clients } = useQuery({
        queryKey: ['clients'],
        queryFn: clientService.getAll
    });

    const mutation = useMutation({
        mutationFn: dealService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deals'] });
            router.push('/deals');
        }
    });

    const onSubmit = (data: any) => {
        mutation.mutate({
            ...data,
            probability: 50
        });
    };

    return (
        <PageWrapper>
            <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                <Button startIcon={<ArrowBack />} onClick={() => router.back()}>Back</Button>
                <Typography variant="h4" fontWeight={700}>Add New Deal</Typography>
            </Stack>

            <Paper sx={{ p: 4, maxWidth: 800 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Deal Title"
                                {...register('title', { required: 'Title is required' })}
                                error={!!errors.title}
                                helperText={errors.title?.message as string}
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
                                label="Value ($)"
                                type="number"
                                {...register('value', { required: 'Value is required' })}
                                error={!!errors.value}
                                helperText={errors.value?.message as string}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Stage"
                                defaultValue="LEAD"
                                {...register('stage', { required: 'Stage is required' })}
                            >
                                {STAGES.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Expected Close Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                {...register('expected_close_date')}
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
                                    {mutation.isPending ? 'Saving...' : 'Create Deal'}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </PageWrapper>
    );
};

export default NewDealPage;
