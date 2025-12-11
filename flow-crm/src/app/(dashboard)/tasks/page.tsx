'use client';

import React from 'react';
import {
    Box,
    Typography,
    Button,
    Stack,
    Checkbox,
    IconButton,
    Paper,
    Divider,
    Chip
} from '@mui/material';
import { Add, Delete, MoreVert, Flag } from '@mui/icons-material';
import PageWrapper from '@/components/common/PageWrapper';

import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/services/taskService';

const TasksPage = () => {
    const { data: tasks, isLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: taskService.getAll
    });

    return (
        <PageWrapper>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Tasks</Typography>
                    <Typography variant="body1" color="text.secondary">Manage your daily to-dos.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />}>
                    Add Task
                </Button>
            </Stack>

            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Paper>
                    {(tasks || []).map((task: any, index: number) => (
                        <React.Fragment key={task.id}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                sx={{
                                    p: 2,
                                    opacity: task.status === 'COMPLETED' ? 0.6 : 1,
                                    bgcolor: task.status === 'COMPLETED' ? 'action.hover' : 'transparent',
                                    textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none'
                                }}
                            >
                                <Checkbox checked={task.status === 'COMPLETED'} />
                                <Box sx={{ flexGrow: 1, ml: 1 }}>
                                    <Typography variant="subtitle1" fontWeight={500}>{task.title}</Typography>
                                    <Typography variant="caption" color="text.secondary">Due: {task.due_date || 'No due date'}</Typography>
                                </Box>
                                <Chip
                                    label={task.priority}
                                    size="small"
                                    color={task.priority === 'HIGH' ? 'error' : task.priority === 'MEDIUM' ? 'warning' : 'success'}
                                    variant="outlined"
                                    sx={{ mr: 2 }}
                                />
                                <IconButton size="small"><MoreVert /></IconButton>
                            </Stack>
                            {index < (tasks || []).length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                    {isLoading && <Box p={3} textAlign="center">Loading tasks...</Box>}
                </Paper>
            </Box>
        </PageWrapper>
    );
};

export default TasksPage;
