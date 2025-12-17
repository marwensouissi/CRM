'use client';

import React from 'react';
import { Box, Button, Typography, TextField, Stack, Paper, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import PageWrapper from '@/components/common/PageWrapper';
import { ArrowBack } from '@mui/icons-material';

const NewClientPage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const mutation = useMutation({
        mutationFn: clientService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            router.push('/clients');
        },
        onError: (error: any) => {
            console.error('Failed to create client', error);
            // Could add toast handling here
        }
    });

    const onSubmit = (data: any) => {
        mutation.mutate({
            ...data,
            total_spent: 0,
            status: 'ACTIVE'
        });
    };

    return (
        <PageWrapper>
            <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                <Button startIcon={<ArrowBack />} onClick={() => router.back()}>Back</Button>
                <Typography variant="h4" fontWeight={700}>Add New Client</Typography>
            </Stack>

            <Paper sx={{ p: 4, maxWidth: 800 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Company / Client Name"
                                {...register('name', { required: 'Name is required' })}
                                error={!!errors.name}
                                helperText={errors.name?.message as string}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Industry"
                                {...register('industry')}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                error={!!errors.email}
                                helperText={errors.email?.message as string}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Phone"
                                {...register('phone')}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Address"
                                multiline
                                rows={2}
                                {...register('address')}
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
                                    {mutation.isPending ? 'Saving...' : 'Create Client'}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </PageWrapper>
    );
};

export default NewClientPage;
