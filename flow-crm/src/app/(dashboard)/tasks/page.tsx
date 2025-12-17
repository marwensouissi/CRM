'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    DropAnimation,
    useDroppable
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Typography, Card, CardContent, Stack, Avatar, Chip, useTheme, IconButton, CircularProgress, Button, Tooltip, AvatarGroup } from '@mui/material';
import { MoreHoriz, Add, CalendarToday } from '@mui/icons-material';
import PageWrapper from '@/components/common/PageWrapper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/taskService';
import { useRouter } from 'next/navigation';

// --- Types ---

type Task = {
    id: number;
    title: string;
    description?: string;
    priority: string; // LOW, MEDIUM, HIGH
    status: string; // PENDING, IN_PROGRESS, COMPLETED
    due_date?: string;
    assignedUser?: {
        name: string;
        email: string;
    };
};

type ColumnType = {
    id: string;
    title: string;
    items: Task[];
    color: string;
};

// Status Mapping
const STATUS_MAP: Record<string, string> = {
    'PENDING': 'pending',
    'IN_PROGRESS': 'in_progress',
    'COMPLETED': 'completed'
};

const REVERSE_STATUS_MAP: Record<string, string> = {
    'pending': 'PENDING',
    'in_progress': 'IN_PROGRESS',
    'completed': 'COMPLETED'
};

const COLUMN_DEFINITIONS: Omit<ColumnType, 'items'>[] = [
    { id: 'pending', title: 'Pending', color: '#64748b' },
    { id: 'in_progress', title: 'In Progress', color: '#eab308' },
    { id: 'completed', title: 'Completed', color: '#22c55e' },
];

const SortableTaskCard = ({ task }: { task: Task }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id, data: { ...task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'HIGH': return 'error';
            case 'MEDIUM': return 'warning';
            default: return 'default';
        }
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            sx={{ mb: 2, cursor: 'grab', '&:hover': { boxShadow: 3 } }}
        >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Chip
                        label={task.priority}
                        size="small"
                        color={getPriorityColor(task.priority) as any}
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                    <IconButton size="small"><MoreHoriz fontSize="small" /></IconButton>
                </Stack>

                <Typography variant="body1" fontWeight={600} gutterBottom sx={{ lineHeight: 1.3 }}>
                    {task.title}
                </Typography>

                {task.description && (
                    <Typography variant="body2" color="text.secondary" sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 2
                    }}>
                        {task.description}
                    </Typography>
                )}

                <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                    {task.due_date ? (
                        <Tooltip title="Due Date">
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <CalendarToday fontSize="inherit" color="action" />
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </Typography>
                            </Stack>
                        </Tooltip>
                    ) : <Box />}

                    {task.assignedUser ? (
                        <Tooltip title={task.assignedUser.name}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: 'primary.main' }}>
                                {task.assignedUser.name.charAt(0)}
                            </Avatar>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Unassigned">
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>?</Avatar>
                        </Tooltip>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};

const KanBanColumn = ({ col }: { col: ColumnType }) => {
    const { isOver, setNodeRef } = useDroppable({ id: col.id });
    const theme = useTheme();

    return (
        <Box
            ref={setNodeRef}
            sx={{
                width: 320,
                minWidth: 320,
                height: '100%',
                backgroundColor: isOver
                    ? theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800]
                    : theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                transition: 'background-color 0.2s ease',
                borderRadius: 2,
                p: 2,
                mr: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: col.color }} />
                <Typography variant="subtitle1" fontWeight={600}>
                    {col.title}
                </Typography>
                <Chip label={col.items.length} size="small" sx={{ ml: 'auto', height: 20 }} />
            </Stack>

            <SortableContext
                id={col.id}
                items={col.items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
            >
                <Box sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': { display: 'none' },
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none'
                }}>
                    {col.items.map((task) => (
                        <SortableTaskCard key={task.id} task={task} />
                    ))}
                </Box>
            </SortableContext>
        </Box>
    );
};

const TasksPage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [activeId, setActiveId] = useState<number | null>(null);
    const [activeContainerId, setActiveContainerId] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const { data: tasksData, isLoading, error } = useQuery({
        queryKey: ['tasks'],
        queryFn: taskService.getAll
    });

    const initialColumns = useMemo<ColumnType[]>(() => {
        if (!tasksData) {
            return COLUMN_DEFINITIONS.map(col => ({ ...col, items: [] }));
        }

        const grouped: Record<string, Task[]> = {};
        COLUMN_DEFINITIONS.forEach(col => { grouped[col.id] = []; });

        tasksData.forEach((apiTask: any) => {
            const columnId = STATUS_MAP[apiTask.status] || 'pending';
            const task: Task = {
                id: apiTask.id,
                title: apiTask.title,
                description: apiTask.description,
                priority: apiTask.priority,
                status: apiTask.status,
                due_date: apiTask.due_date,
                assignedUser: apiTask.assigned_user // Backend uses assigned_user snake case usually, but wait, Controller returns assignedUser camel case relation?
                // Laravel returns relation as snake_case if serialized, or camelCase if explicit?
                // Standard Laravel serialization uses snake_case for attributes, but relations are keys in array.
                // Let's assume camelCase 'assignedUser' based on loaded relation name, or snake_case 'assigned_user' if toArray() converts it.
                // Often 'assigned_user' in JSON if relation is 'assignedUser'.
            };
            // Hotfix: Check both casings
            const user = apiTask.assigned_user || apiTask.assignedUser;
            if (user) task.assignedUser = user;

            if (grouped[columnId]) {
                grouped[columnId].push(task);
            }
        });

        return COLUMN_DEFINITIONS.map(col => ({
            ...col,
            items: grouped[col.id] || []
        }));
    }, [tasksData]);

    const [columns, setColumns] = useState<ColumnType[]>(initialColumns);

    useEffect(() => {
        setColumns(initialColumns);
    }, [initialColumns]);

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            taskService.update(id, { status }),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    // DnD Handlers
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const findContainer = (id: string | number) => {
        if (typeof id === 'string' && columns.some((col) => col.id === id)) return id;
        const container = columns.find((col) => col.items.some((item) => item.id === id));
        return container?.id;
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as number);
        const containerId = findContainer(active.id);
        if (containerId) setActiveContainerId(containerId);
        const container = columns.find(c => c.id === containerId);
        const item = container?.items.find(i => i.id === active.id);
        if (item) setActiveTask(item);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        const overId = over?.id;
        if (!overId || active.id === overId) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) return;

        setColumns((prev) => {
            const activeItems = prev.find(c => c.id === activeContainer)?.items;
            const overItems = prev.find(c => c.id === overContainer)?.items;
            if (!activeItems || !overItems) return prev;

            const activeIndex = activeItems.findIndex(i => i.id === active.id);
            const overIndex = overItems.findIndex(i => i.id === overId);

            let newIndex;
            if (overId === overContainer) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;
                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return prev.map(c => {
                if (c.id === activeContainer) return { ...c, items: activeItems.filter(i => i.id !== active.id) };
                if (c.id === overContainer) {
                    const itemToMove = activeItems[activeIndex];
                    return {
                        ...c,
                        items: [
                            ...overItems.slice(0, newIndex),
                            itemToMove,
                            ...overItems.slice(newIndex, overItems.length)
                        ]
                    };
                }
                return c;
            })
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const overContainer = findContainer(over?.id || '');

        if (activeContainerId && overContainer && activeContainerId !== overContainer) {
            const newStatus = REVERSE_STATUS_MAP[overContainer];
            if (newStatus) {
                updateStatusMutation.mutate({
                    id: active.id as number,
                    status: newStatus
                });
            }
        }
        setActiveId(null);
        setActiveTask(null);
        setActiveContainerId(null);
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: '0.5' } },
        }),
    };

    if (isLoading && !tasksData) return <PageWrapper><CircularProgress /></PageWrapper>;

    return (
        <PageWrapper>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Tasks Board</Typography>
                    <Typography variant="body1" color="text.secondary">Drag and drop to manage task progress.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => router.push('/tasks/new')}>
                    Add Task
                </Button>
            </Stack>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <Box sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    height: 'calc(100vh - 200px)',
                    pb: 2,
                    '&::-webkit-scrollbar': { display: 'none' },
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none'
                }}>
                    {columns.map((col) => (
                        <KanBanColumn key={col.id} col={col} />
                    ))}
                </Box>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeTask ? (
                        <Card sx={{ width: 300, cursor: 'grabbing', boxShadow: 5 }}>
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="body1" fontWeight={600}>{activeTask.title}</Typography>
                            </CardContent>
                        </Card>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </PageWrapper>
    );
};

export default TasksPage;
