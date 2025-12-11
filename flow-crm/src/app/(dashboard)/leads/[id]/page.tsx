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
import PageWrapper from '@/components/common/PageWrapper';
import NotesSection from '@/components/features/leads/NotesSection';

// Mock Lead Data - in real app, fetch via ID
const mockLead = {
    id: '1',
    name: 'John Doe',
    company: 'TechCorp Inc.',
    email: 'john.doe@techcorp.com',
    phone: '+1 (555) 123-4567',
    value: '$12,000',
    status: 'Qualified',
    owner: 'Alice Smith',
    lastContact: '2 days ago',
};

const steps = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won/Lost'];

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const LeadDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
    // Unwrap params using React.use() for Client Components in Next 15/16 if async params passed 
    // BUT since this is a client component ('use client'), params prop is passed directly typically?
    // Actually in Next 15, params is a Promise. Even in client components.
    // If we use 'use client', better to use `use(params)`.
    const { id } = use(params);

    const [tabValue, setTabValue] = React.useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const activeStep = steps.indexOf(mockLead.status);

    return (
        <PageWrapper>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>{mockLead.name.charAt(0)}</Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight={700}>{mockLead.name}</Typography>
                            <Typography variant="subtitle1" color="text.secondary">{mockLead.company}</Typography>
                        </Box>
                    </Stack>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button startIcon={<Edit />} variant="outlined">Edit</Button>
                    <Button startIcon={<Delete />} variant="outlined" color="error">Delete</Button>
                    <Button variant="contained">Convert to Client</Button>
                </Stack>
            </Stack>

            {/* Stages Stepper */}
            <Paper sx={{ mb: 4, p: 3 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
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
                                <ListItemText primary="Email" secondary={mockLead.email} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Phone color="action" /></ListItemIcon>
                                <ListItemText primary="Phone" secondary={mockLead.phone} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Business color="action" /></ListItemIcon>
                                <ListItemText primary="Company" secondary={mockLead.company} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CalendarToday color="action" /></ListItemIcon>
                                <ListItemText primary="Last Contact" secondary={mockLead.lastContact} />
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
