'use client';

import React from 'react';
import {
    TextField,
    Button,
    Link,
    Box,
    Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthLayout from '@/components/features/auth/AuthLayout';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm<ForgotPasswordInputs>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordInputs) => {
        // Simulate API call
        console.log('Reset email for:', data.email);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // Usually show success message
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter your email to receive reset instructions."
        >
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: '100%' }}>
                {isSubmitSuccessful && (
                    <Typography color="success.main" sx={{ mb: 2, textAlign: 'center' }}>
                        If an account exists with that email, we have sent instructions.
                    </Typography>
                )}

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    autoFocus
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ mb: 3 }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ mb: 3, height: 48, fontSize: '1rem' }}
                >
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <Box textAlign="center">
                    <NextLink href="/login" passHref legacyBehavior>
                        <Link variant="body2" underline="hover" sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Return to Sign In
                        </Link>
                    </NextLink>
                </Box>
            </Box>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
