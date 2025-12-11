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
} from '@mui/material';
import {
    Edit,
    Phone,
    Email,
    Business,
    LocationOn,
    Person,
    Description
} from '@mui/icons-material';
import PageWrapper from '@/components/common/PageWrapper';

// Mock Client Data
const mockClient = {
    id: '1',
    name: 'Acme Corp',
    industry: 'Technology',
    email: 'contact@acme.com',
    phone: '+1 (555) 000-0000',
    address: '123 Tech Blvd, Silicon Valley, CA',
    status: 'Active',
};

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
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <PageWrapper>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ width: 64, height: 64, bgcolor: 'secondary.main' }}>{mockClient.name.charAt(0)}</Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight={700}>{mockClient.name}</Typography>
                            <Typography variant="subtitle1" color="text.secondary">{mockClient.industry}</Typography>
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
                                <ListItemText primary="Email" secondary={mockClient.email} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Phone color="action" /></ListItemIcon>
                                <ListItemText primary="Phone" secondary={mockClient.phone} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Business color="action" /></ListItemIcon>
                                <ListItemText primary="Industry" secondary={mockClient.industry} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><LocationOn color="action" /></ListItemIcon>
                                <ListItemText primary="Address" secondary={mockClient.address} />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>

                {/* Right Column: Related Data */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ minHeight: 400 }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="client tabs">
                                <Tab label="Contacts" />
                                <Tab label="Documents" />
                                <Tab label="Interactions" />
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={tabValue} index={0}>
                            <List>
                                <ListItem>
                                    <ListItemIcon><Person /></ListItemIcon>
                                    <ListItemText primary="John Doe" secondary="CEO - john@acme.com" />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemIcon><Person /></ListItemIcon>
                                    <ListItemText primary="Jane Smith" secondary="CTO - jane@acme.com" />
                                </ListItem>
                            </List>
                        </CustomTabPanel>
                        <CustomTabPanel value={tabValue} index={1}>
                            <List>
                                <ListItem>
                                    <ListItemIcon><Description /></ListItemIcon>
                                    <ListItemText primary="Contract.pdf" secondary="Signed on 2023-01-01" />
                                </ListItem>
                            </List>
                        </CustomTabPanel>
                        <CustomTabPanel value={tabValue} index={2}>
                            <Typography color="text.secondary">No recent interactions.</Typography>
                        </CustomTabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </PageWrapper>
    );
};

export default ClientDetailsPage;
