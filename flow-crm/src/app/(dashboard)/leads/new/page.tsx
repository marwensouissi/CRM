'use client';

import React, { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PageWrapper from '@/components/common/PageWrapper';
import LeadForm from '@/components/features/leads/LeadForm';
import { leadService } from '@/services/leadService';

const NewLeadPage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: leadService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            router.push('/leads');
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to create lead');
        }
    });

    const handleSubmit = async (data: any) => {
        setError(null);
        await mutateAsync(data);
    };

    return (
        <PageWrapper>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h" fontWeight={700} gutterBottom>
                    Create New Lead
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Add a new lead to your pipeline
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <LeadForm onSubmit={handleSubmit} isLoading={isPending} />
        </PageWrapper>
    );
};

export default NewLeadPage;
