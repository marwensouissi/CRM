'use client';

import React, { useState } from 'react';
import {
    TextField,
    Button,
    Link,
    Box,
    InputAdornment,
    IconButton,
    Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthLayout from '@/components/features/auth/AuthLayout';
import { useAuth } from '@/context/AuthContext';

const registerSchema = z.object({
    name: z.string().min(2, 'Name is too short'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterPage = () => {
    const router = useRouter();
    const { register: registerUser } = useAuth(); // Hook from auth context
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormInputs) => {
        try {
            await registerUser({
                name: data.name,
                email: data.email,
                password: data.password,
                password_confirmation: data.password // Backend expects confirmation
            });
            // Router push is handled in context
        } catch (error) {
            console.error('Registration failed', error);
            // Handle error (e.g., set form error)
        }
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Start your free trial today."
        >
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: '100%' }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    autoComplete="name"
                    autoFocus
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ mb: 2 }}
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ mb: 2 }}
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="new-password"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
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
                    {isSubmitting ? 'Creating account...' : 'Sign Up'}
                </Button>

                <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                        Already have an account?{' '}
                        <Link
                            component={NextLink}
                            href="/login"
                            variant="body2"
                            fontWeight={600}
                            underline="hover"
                            sx={{ cursor: 'pointer' }}
                        >
                            Sign in
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </AuthLayout>
    );
};

export default RegisterPage;
