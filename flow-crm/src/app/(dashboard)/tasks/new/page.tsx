'use client';

import React from 'react';
import { Box, Button, Typography, TextField, Stack, Paper, MenuItem, Grid, Avatar } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/taskService';
import { teamService } from '@/services/teamService';
import PageWrapper from '@/components/common/PageWrapper';
import { ArrowBack } from '@mui/icons-material';

const PRIORITIES = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' }
];

const STATUSES = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' }
];

const NewTaskPage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const { data: users } = useQuery({
        queryKey: ['team'],
        queryFn: teamService.getAll
    });

    const mutation = useMutation({
        mutationFn: taskService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            router.push('/tasks');
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
                <Typography variant="h4" fontWeight={700}>Add New Task</Typography>
            </Stack>

            <Paper sx={{ p: 4, maxWidth: 800 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Task Title"
                                {...register('title', { required: 'Title is required' })}
                                error={!!errors.title}
                                helperText={errors.title?.message as string}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={3}
                                {...register('description')}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Assign To"
                                defaultValue=""
                                {...register('assigned_to')}
                                SelectProps={{
                                    renderValue: (selected) => {
                                        const user = users?.find(u => u.id === Number(selected));
                                        return user ? user.name : '';
                                    }
                                }}
                            >
                                <MenuItem value="">
                                    <em>Unassigned</em>
                                </MenuItem>
                                {users?.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                                                {user.name.charAt(0)}
                                            </Avatar>
                                            <Typography>{user.name}</Typography>
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </TextField>
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
                                defaultValue="PENDING"
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
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button variant="outlined" onClick={() => router.back()}>Cancel</Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={mutation.isPending}
                                >
                                    {mutation.isPending ? 'Saving...' : 'Create Task'}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </PageWrapper>
    );
};

export default NewTaskPage;
