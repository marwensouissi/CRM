'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Stack, Divider, LinearProgress } from '@mui/material';

const team = [
    { name: 'Sarah Wilson', sales: 45000, target: 50000, avatar: '/static/images/avatar/2.jpg' },
    { name: 'Mike Jones', sales: 38000, target: 40000, avatar: '/static/images/avatar/3.jpg' },
    { name: 'Emma Davis', sales: 25000, target: 30000, avatar: '/static/images/avatar/4.jpg' },
];

const TeamLeaderboard = () => {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Team Leaderboard
                </Typography>
                <Stack spacing={3} mt={2}>
                    {team.map((member, index) => (
                        <Box key={member.name}>
                            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                <Avatar src={member.avatar} alt={member.name} />
                                <Box flexGrow={1}>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {member.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        ${member.sales.toLocaleString()} / ${member.target.toLocaleString()}
                                    </Typography>
                                </Box>
                                <Typography variant="h6" color="primary" fontWeight={700}>
                                    {Math.round((member.sales / member.target) * 100)}%
                                </Typography>
                            </Stack>
                            <LinearProgress
                                variant="determinate"
                                value={(member.sales / member.target) * 100}
                                sx={{ borderRadius: 5, height: 6 }}
                                color={index === 0 ? "primary" : "secondary"}
                            />
                        </Box>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default TeamLeaderboard;
