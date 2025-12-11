'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Divider,
    Stack
} from '@mui/material';
import PageWrapper from '@/components/common/PageWrapper';

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

const SettingsPage = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <PageWrapper>
            <Typography variant="h4" fontWeight={700} mb={4}>Settings</Typography>

            <Paper>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="settings tabs">
                        <Tab label="Profile" />
                        <Tab label="Company" />
                        <Tab label="Notifications" />
                    </Tabs>
                </Box>

                {/* Profile Settings */}
                <CustomTabPanel value={value} index={0}>
                    <Typography variant="h6" gutterBottom>Profile Information</Typography>
                    <Stack spacing={3} sx={{ maxWidth: 600 }}>
                        <TextField label="Full Name" defaultValue="Marwen" fullWidth />
                        <TextField label="Email" defaultValue="marwen@example.com" fullWidth />
                        <Button variant="contained" sx={{ width: 'fit-content' }}>Save Changes</Button>
                    </Stack>
                </CustomTabPanel>

                {/* Company Settings */}
                <CustomTabPanel value={value} index={1}>
                    <Typography variant="h6" gutterBottom>Company Details</Typography>
                    <Stack spacing={3} sx={{ maxWidth: 600 }}>
                        <TextField label="Company Name" defaultValue="FlowCRM" fullWidth />
                        <TextField label="Website" defaultValue="https://flowcrm.com" fullWidth />
                        <Button variant="contained" sx={{ width: 'fit-content' }}>Save Changes</Button>
                    </Stack>
                </CustomTabPanel>

                {/* Notification Settings */}
                <CustomTabPanel value={value} index={2}>
                    <Typography variant="h6" gutterBottom>Preferences</Typography>
                    <Stack spacing={2}>
                        <FormControlLabel control={<Switch defaultChecked />} label="Email Notifications" />
                        <FormControlLabel control={<Switch defaultChecked />} label="Push Notifications" />
                        <FormControlLabel control={<Switch />} label="Weekly Digest" />
                    </Stack>
                </CustomTabPanel>

            </Paper>
        </PageWrapper>
    );
};

export default SettingsPage;
