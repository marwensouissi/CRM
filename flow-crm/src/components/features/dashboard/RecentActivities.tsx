'use client';

import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Box,
    useTheme
} from '@mui/material';
import {
    PersonAdd,
    AttachMoney,
    Email,
    Assignment
} from '@mui/icons-material';

const activities = [
    {
        id: 1,
        user: 'Alice Smith',
        action: 'created a new lead',
        target: 'TechCorp Inc.',
        time: '2 hours ago',
        icon: <PersonAdd fontSize="small" />,
        color: 'primary.main',
    },
    {
        id: 2,
        user: 'Bob Johnson',
        action: 'closed a deal',
        target: '$12,500 - MegaSoft',
        time: '4 hours ago',
        icon: <AttachMoney fontSize="small" />,
        color: 'success.main',
    },
    {
        id: 3,
        user: 'Carol Williams',
        action: 'sent an email to',
        target: 'John Doe',
        time: '5 hours ago',
        icon: <Email fontSize="small" />,
        color: 'info.main',
    },
    {
        id: 4,
        user: 'David Brown',
        action: 'updated task',
        target: 'Q3 Marketing Plan',
        time: '1 day ago',
        icon: <Assignment fontSize="small" />,
        color: 'warning.main',
    },
];

const RecentActivities = () => {
    const theme = useTheme();

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Recent Activities
                </Typography>
                <List>
                    {activities.map((activity, index) => (
                        <ListItem
                            key={activity.id}
                            alignItems="flex-start"
                            disablePadding
                            sx={{
                                mb: 2,
                                '&:last-child': { mb: 0 }
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        bgcolor: (theme) => activity.color.startsWith('#') ? `${activity.color}20` : `${theme.palette[activity.color.split('.')[0] as 'primary'].main}20`,
                                        color: activity.color
                                    }}
                                >
                                    {activity.icon}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle2" component="span" fontWeight={600}>
                                        {activity.user}{' '}
                                        <Typography component="span" variant="body2" color="text.secondary">
                                            {activity.action}
                                        </Typography>{' '}
                                        <Typography component="span" variant="body2" color="primary" fontWeight={500}>
                                            {activity.target}
                                        </Typography>
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="caption" color="text.secondary">
                                        {activity.time}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default RecentActivities;
