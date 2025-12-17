'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { teamService } from '@/services/teamService';
import PageWrapper from '@/components/common/PageWrapper';
import { Box, Button, Typography, Stack, Avatar, Grid, Paper, Card, CardContent, Divider, Chip } from '@mui/material';
import { ArrowBack, Email, MonetizationOn, ConfirmationNumber, Task as TaskIcon } from '@mui/icons-material';

const TeamMemberPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = parseInt(params.id as string);

    const { data: user, isLoading } = useQuery({
        queryKey: ['team', id],
        queryFn: () => teamService.getOne(id),
        enabled: !!id
    });

    if (isLoading) {
        return <PageWrapper><Typography>Loading...</Typography></PageWrapper>;
    }

    if (!user) {
        return <PageWrapper><Typography>User not found</Typography></PageWrapper>;
    }

    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    // Calculate generic stats
    const totalDealValue = user.deals?.reduce((sum: number, deal: any) => sum + Number(deal.value), 0) || 0;
    const closedWonDeals = user.deals?.filter((deal: any) => deal.stage === 'WON') || [];
    const openTasks = user.tasks?.filter((task: any) => task.status !== 'COMPLETED') || [];
    const activeTickets = user.tickets?.filter((ticket: any) => ticket.status !== 'CLOSED' && ticket.status !== 'RESOLVED') || [];

    return (
        <PageWrapper>
            <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                <Button startIcon={<ArrowBack />} onClick={() => router.back()}>Back</Button>
                <Typography variant="h4" fontWeight={700}>Member Profile</Typography>
            </Stack>

            <Grid container spacing={4}>
                {/* Profile Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 4, height: '100%', textAlign: 'center' }}>
                        <Avatar
                            sx={{ width: 120, height: 120, fontSize: 48, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="h5" fontWeight={700}>{user.name}</Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>{user.title || 'Team Member'}</Typography>

                        <Chip
                            label={user.role}
                            color={user.role === 'ADMIN' ? 'error' : user.role === 'MANAGER' ? 'warning' : 'default'}
                            sx={{ mb: 3 }}
                        />

                        <Divider sx={{ my: 2 }} />

                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" color="text.secondary">
                            <Email fontSize="small" />
                            <Typography variant="body2">{user.email}</Typography>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Stats & Activity */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Grid container spacing={3} mb={4}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                                <CardContent>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="overline" sx={{ opacity: 0.8 }}>Closed Revenue</Typography>
                                            <Typography variant="h5" fontWeight={700}>
                                                {formatCurrency(closedWonDeals.reduce((sum: number, d: any) => sum + Number(d.value), 0))}
                                            </Typography>
                                        </Box>
                                        <MonetizationOn fontSize="large" sx={{ opacity: 0.3 }} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                                <CardContent>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="overline" sx={{ opacity: 0.8 }}>Active Tickets</Typography>
                                            <Typography variant="h5" fontWeight={700}>{activeTickets.length}</Typography>
                                        </Box>
                                        <ConfirmationNumber fontSize="large" sx={{ opacity: 0.3 }} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
                                <CardContent>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="overline" sx={{ opacity: 0.8 }}>Pending Tasks</Typography>
                                            <Typography variant="h5" fontWeight={700}>{openTasks.length}</Typography>
                                        </Box>
                                        <TaskIcon fontSize="large" sx={{ opacity: 0.3 }} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h6" fontWeight={700} mb={3}>Recent Assigned Items</Typography>

                        {user.deals && user.deals.length > 0 && (
                            <Box mb={3}>
                                <Typography variant="subtitle2" color="primary" gutterBottom>Deals</Typography>
                                {user.deals.slice(0, 3).map((deal: any) => (
                                    <Box key={deal.id} sx={{ p: 1, borderBottom: '1px solid #eee' }}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" fontWeight={500}>{deal.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">{formatCurrency(deal.value)}</Typography>
                                        </Stack>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {user.tickets && user.tickets.length > 0 && (
                            <Box mb={3}>
                                <Typography variant="subtitle2" color="warning.main" gutterBottom>Tickets</Typography>
                                {user.tickets.slice(0, 3).map((ticket: any) => (
                                    <Box key={ticket.id} sx={{ p: 1, borderBottom: '1px solid #eee' }}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" fontWeight={500}>{ticket.subject}</Typography>
                                            <Chip label={ticket.status} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                                        </Stack>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {(user.deals?.length === 0 && user.tickets?.length === 0) && (
                            <Typography color="text.secondary">No recent activity found.</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </PageWrapper>
    );
};

export default TeamMemberPage;
