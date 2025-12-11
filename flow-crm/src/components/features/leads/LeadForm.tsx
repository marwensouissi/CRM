'use client';

import React from 'react';
import {
    Box,
    Button,
    TextField,
    Grid,
    MenuItem,
    Typography,
    Paper,
    CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lead } from '@/services/leadService';

const leadSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email').or(z.literal('')),
    phone: z.string().optional(),
    company: z.string().optional(),
    status: z.string().min(1, 'Please select a status'),
    source: z.string().optional(),
    value: z.number().min(0, 'Value must be positive').or(z.literal(0)),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
    initialData?: Partial<Lead>;
    onSubmit: (data: LeadFormData) => Promise<void>;
    isLoading?: boolean;
}

const statusOptions = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST'];
const sourceOptions = ['WEBSITE', 'REFERRAL', 'COLD_CALL', 'EMAIL', 'SOCIAL_MEDIA', 'OTHER'];

const LeadForm = ({ initialData, onSubmit, isLoading = false }: LeadFormProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<LeadFormData>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            name: initialData?.name || '',
            email: initialData?.email || '',
            phone: initialData?.phone || '',
            company: initialData?.company || '',
            status: initialData?.status || 'NEW',
            source: initialData?.source || '',
            value: initialData?.value || 0,
        }
    });

    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider' }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Name *"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    fullWidth
                                    type="email"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Phone"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="company"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Company"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Status *"
                                    fullWidth
                                    select
                                    error={!!errors.status}
                                    helperText={errors.status?.message}
                                >
                                    {statusOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Controller
                            name="source"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Source"
                                    fullWidth
                                    select
                                >
                                    {sourceOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option.replace('_', ' ')}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Controller
                            name="value"
                            control={control}
                            render={({ field: { onChange, value, ...field } }) => (
                                <TextField
                                    {...field}
                                    value={value || ''}
                                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                                    label="Value ($)"
                                    fullWidth
                                    type="number"
                                    error={!!errors.value}
                                    helperText={errors.value?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={isLoading}
                                startIcon={isLoading && <CircularProgress size={20} />}
                            >
                                {isLoading ? 'Saving...' : initialData ? 'Update Lead' : 'Create Lead'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default LeadForm;
