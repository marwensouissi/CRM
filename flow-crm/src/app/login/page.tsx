'use client';

import React, { useState } from 'react';
import {
    TextField,
    Button,
    Link,
    Box,
    InputAdornment,
    IconButton,
    Checkbox,
    FormControlLabel,
    Alert,
    Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthLayout from '@/components/features/auth/AuthLayout';
import { useAuth } from '@/context/AuthContext';

// Validation Schema
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const router = useRouter();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            setError(null);
            await login(data);
        } catch (err: any) {
            console.error('Login failed', err);
            setError('Invalid email or password');
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Please enter your details to sign in."
        >
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: '100%' }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
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
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
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
                    sx={{ mb: 1 }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <NextLink href="/forgot-password" passHref legacyBehavior>
                        <Link variant="body2" underline="hover" sx={{ cursor: 'pointer' }}>
                            Forgot password?
                        </Link>
                    </NextLink>
                </Box>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ mb: 3, height: 48, fontSize: '1rem' }}
                >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>

                <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                        Don&apos;t have an account?{' '}
                        <NextLink href="/register" passHref legacyBehavior>
                            <Link variant="body2" fontWeight={600} underline="hover" sx={{ cursor: 'pointer' }}>
                                Sign up
                            </Link>
                        </NextLink>
                    </Typography>
                </Box>
            </Box>
        </AuthLayout>
    );
};

export default LoginPage;
