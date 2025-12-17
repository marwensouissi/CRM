'use client';

import React, { use, useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Paper,
    Button,
    Stack,
    Avatar,
    Divider,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    CircularProgress,
    Chip
} from '@mui/material';
import {
    Edit,
    Phone,
    Email,
    Business,
    LocationOn,
    Person,
    Description,
    MonetizationOn,
    ArrowBack
} from '@mui/icons-material';
import PageWrapper from '@/components/common/PageWrapper';
import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import { useRouter } from 'next/navigation';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const ClientDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const router = useRouter();
    const [tabValue, setTabValue] = useState(0);

    const { data: client, isLoading, error } = useQuery({
        queryKey: ['client', id],
        queryFn: () => clientService.getOne(Number(id))
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (isLoading) {
        return (
            <PageWrapper>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </PageWrapper>
        );
    }

    if (error || !client) {
        return (
            <PageWrapper>
                <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                    <Button startIcon={<ArrowBack />} onClick={() => router.back()}>Back</Button>
                </Stack>
                <Typography variant="h5">Client not found</Typography>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button startIcon={<ArrowBack />} onClick={() => router.back()} sx={{ mr: 2 }}>Back</Button>
                        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                            {client.name.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight={700}>{client.name}</Typography>
                            <Typography variant="subtitle1" color="text.secondary">{client.industry || 'No Industry'}</Typography>
                        </Box>
                    </Stack>
                </Box>
                <Button startIcon={<Edit />} variant="outlined">Edit Profile</Button>
            </Stack>

            <Grid container spacing={3}>
                {/* Left Column: Info */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 0, overflow: 'hidden' }}>
                        <Box sx={{ p: 2, bgcolor: 'background.neutral' }}>
                            <Typography variant="h6" fontWeight={600}>Client Details</Typography>
                        </Box>
                        <Divider />
                        <List>
                            <ListItem>
                                <ListItemIcon><Email color="action" /></ListItemIcon>
                                <ListItemText primary="Email" secondary={client.email} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Phone color="action" /></ListItemIcon>
                                <ListItemText primary="Phone" secondary={client.phone || 'N/A'} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Business color="action" /></ListItemIcon>
                                <ListItemText primary="Industry" secondary={client.industry || 'N/A'} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><LocationOn color="action" /></ListItemIcon>
                                <ListItemText primary="Address" secondary={client.address || 'N/A'} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><MonetizationOn color="action" /></ListItemIcon>
                                <ListItemText primary="Total Spent" secondary={`$${client.total_spent ? client.total_spent.toLocaleString() : '0'}`} />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>

                {/* Right Column: Related Data */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ minHeight: 400 }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="client tabs">
                                <Tab label="Deals" />
                                <Tab label="Notes" />
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={tabValue} index={0}>
                            {client.deals && client.deals.length > 0 ? (
                                <List>
                                    {client.deals.map(deal => (
                                        <div key={deal.id}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={deal.title}
                                                    secondary={`Value: $${deal.value.toLocaleString()} - Created: ${new Date(deal.created_at).toLocaleDateString()}`}
                                                />
                                                <Chip label={deal.status} size="small" color={deal.status === 'WON' ? 'success' : 'default'} />
                                            </ListItem>
                                            <Divider component="li" />
                                        </div>
                                    ))}
                                </List>
                            ) : (
                                <Typography color="text.secondary">No deals found.</Typography>
                            )}
                        </CustomTabPanel>
                        <CustomTabPanel value={tabValue} index={1}>
                            <Typography color="text.secondary">Notes feature coming soon.</Typography>
                        </CustomTabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </PageWrapper>
    );
};

export default ClientDetailsPage;
