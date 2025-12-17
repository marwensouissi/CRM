'use client';

import React, { use } from 'react';
import {
    Box,
    Grid,
    Typography,
    Paper,
    Button,
    Stack,
    Chip,
    Avatar,
    Divider,
    Tabs,
    Tab,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import {
    Edit,
    Delete,
    Phone,
    Email,
    Business,
    CalendarToday,
    CheckCircle,
    Note
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '@/services/leadService';
import PageWrapper from '@/components/common/PageWrapper';
import NotesSection from '@/components/features/leads/NotesSection';

const steps = [
    { label: 'New', value: 'NEW' },
    { label: 'Contacted', value: 'CONTACTED' },
    { label: 'Qualified', value: 'QUALIFIED' },
    { label: 'Proposal Sent', value: 'PROPOSAL' },
    { label: 'Won', value: 'WON' },
    { label: 'Lost', value: 'LOST' }
];

const LeadDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const queryClient = useQueryClient();

    const [tabValue, setTabValue] = React.useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Fetch lead data
    const { data: lead, isLoading } = useQuery({
        queryKey: ['lead', id],
        queryFn: () => leadService.getById(parseInt(id)),
    });

    // Update status mutation
    const updateStatusMutation = useMutation({
        mutationFn: ({ status }: { status: string }) =>
            leadService.updateStatus(parseInt(id), status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lead', id] });
            queryClient.invalidateQueries({ queryKey: ['leads'] }); // Refresh kanban too
        }
    });

    const handleStatusClick = (newStatus: string) => {
        updateStatusMutation.mutate({ status: newStatus });
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

    if (!lead) return null;

    const activeStep = steps.findIndex(s => s.value === lead.status);

    return (
        <PageWrapper>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>{lead.name.charAt(0)}</Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight={700}>{lead.name}</Typography>
                            <Typography variant="subtitle1" color="text.secondary">{lead.company}</Typography>
                        </Box>
                    </Stack>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button startIcon={<Edit />} variant="outlined">Edit</Button>
                    <Button startIcon={<Delete />} variant="outlined" color="error">Delete</Button>
                    {/* Convert button logic could go here */}
                </Stack>
            </Stack>

            {/* Stages Stepper */}
            <Paper sx={{ mb: 4, p: 3 }}>
                <Stepper activeStep={activeStep} alternativeLabel nonLinear>
                    {steps.map((step) => (
                        <Step key={step.label}>
                            <StepLabel
                                onClick={() => handleStatusClick(step.value)}
                                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                            >
                                {step.label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            <Grid container spacing={3}>
                {/* Left Column: Info */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 0, overflow: 'hidden' }}>
                        <Box sx={{ p: 2, bgcolor: 'background.neutral' }}>
                            <Typography variant="h6" fontWeight={600}>Lead Information</Typography>
                        </Box>
                        <Divider />
                        <List>
                            <ListItem>
                                <ListItemIcon><Email color="action" /></ListItemIcon>
                                <ListItemText primary="Email" secondary={lead.email || 'N/A'} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Phone color="action" /></ListItemIcon>
                                <ListItemText primary="Phone" secondary={lead.phone || 'N/A'} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Business color="action" /></ListItemIcon>
                                <ListItemText primary="Company" secondary={lead.company} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CalendarToday color="action" /></ListItemIcon>
                                <ListItemText primary="Value" secondary={`$${lead.value}`} />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>

                {/* Right Column: Activities/Notes */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ minHeight: 400 }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="lead tabs">
                                <Tab label="Activity timeline" />
                                <Tab label="Notes" />
                                <Tab label="Files" />
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={tabValue} index={0}>
                            <Typography variant="subtitle2" gutterBottom>Today</Typography>
                            <Stack spacing={2}>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Stack direction="row" spacing={2}>
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'success.light' }}><CheckCircle fontSize="small" /></Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={600}>Email Sent</Typography>
                                            <Typography variant="body2" color="text.secondary">Follow-up on proposal.</Typography>
                                            <Typography variant="caption" color="text.secondary">10:30 AM</Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Stack>
                        </CustomTabPanel>
                        <CustomTabPanel value={tabValue} index={1}>
                            <NotesSection leadId={parseInt(id)} />
                        </CustomTabPanel>
                        <CustomTabPanel value={tabValue} index={2}>
                            <Typography color="text.secondary">No files uploaded.</Typography>
                        </CustomTabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </PageWrapper>
    );
};

export default LeadDetailsPage;
