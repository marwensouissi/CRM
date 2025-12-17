'use client';

import React from 'react';
import { Box, Button, Typography, TextField, Stack, Paper, MenuItem, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '@/services/ticketService';
import { clientService } from '@/services/clientService';
import PageWrapper from '@/components/common/PageWrapper';
import { ArrowBack } from '@mui/icons-material';

const PRIORITIES = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' }
];

const STATUSES = [
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' }
];

const NewTicketPage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const { data: clients } = useQuery({
        queryKey: ['clients'],
        queryFn: clientService.getAll
    });

    const mutation = useMutation({
        mutationFn: ticketService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
            router.push('/tickets');
        }
    });

    const onSubmit = (data: any) => {
        mutation.mutate(data);
    };

    return (
        <PageWrapper>
            <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                <Button startIcon={<ArrowBack />} onClick={() => router.back()}>Back</Button>
                <Typography variant="h4" fontWeight={700}>Create Ticket</Typography>
            </Stack>

            <Paper sx={{ p: 4, maxWidth: 800 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Subject"
                                {...register('subject', { required: 'Subject is required' })}
                                error={!!errors.subject}
                                helperText={errors.subject?.message as string}
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
                                select
                                fullWidth
                                label="Priority"
                                defaultValue="MEDIUM"
                                {...register('priority')}
                            >
                                {PRIORITIES.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Status"
                                defaultValue="OPEN"
                                {...register('status')}
                            >
                                {STATUSES.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={4}
                                {...register('description')}
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
                                    {mutation.isPending ? 'Creating...' : 'Create Ticket'}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </PageWrapper>
    );
};

export default NewTicketPage;
