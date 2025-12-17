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
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Typography, Card, CardContent, Stack, Avatar, Chip, useTheme, IconButton, CircularProgress, Button } from '@mui/material';
import { MoreHoriz, Add } from '@mui/icons-material';
import PageWrapper from '@/components/common/PageWrapper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService, Ticket as ApiTicket } from '@/services/ticketService';
import { useRouter } from 'next/navigation';

// --- Types ---

type Ticket = {
    id: number;
    subject: string;
    clientName?: string;
    priority: string;
    description?: string;
};

type ColumnType = {
    id: string;
    title: string;
    items: Ticket[];
    color: string;
};

// Status mapping
const STATUS_MAP: Record<string, string> = {
    'OPEN': 'open',
    'IN_PROGRESS': 'in_progress',
    'RESOLVED': 'resolved',
    'CLOSED': 'closed'
};

const REVERSE_STATUS_MAP: Record<string, string> = {
    'open': 'OPEN',
    'in_progress': 'IN_PROGRESS',
    'resolved': 'RESOLVED',
    'closed': 'CLOSED'
};

const COLUMN_DEFINITIONS: Omit<ColumnType, 'items'>[] = [
    { id: 'open', title: 'Open', color: '#3b82f6' },
    { id: 'in_progress', title: 'In Progress', color: '#eab308' },
    { id: 'resolved', title: 'Resolved', color: '#22c55e' },
    { id: 'closed', title: 'Closed', color: '#6b7280' },
];

const SortableTicketCard = ({ ticket }: { ticket: Ticket }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: ticket.id, data: { ...ticket } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'URGENT': return 'error';
            case 'HIGH': return 'warning';
            case 'MEDIUM': return 'info';
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
                    <Chip label={ticket.priority} size="small" color={getPriorityColor(ticket.priority) as any} variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                    <IconButton size="small"><MoreHoriz fontSize="small" /></IconButton>
                </Stack>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>{ticket.subject}</Typography>
                <Typography variant="caption" color="text.secondary">{ticket.clientName || 'No Client'}</Typography>
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
                width: 300,
                minWidth: 300,
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
                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    {col.items.length}
                </Typography>
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
                    {col.items.map((ticket) => (
                        <SortableTicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </Box>
            </SortableContext>
        </Box>
    );
};

const TicketsPage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [activeId, setActiveId] = useState<number | null>(null);
    const [activeContainerId, setActiveContainerId] = useState<string | null>(null);
    const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

    const { data: ticketsData, isLoading, error } = useQuery({
        queryKey: ['tickets'],
        queryFn: ticketService.getAll
    });

    const initialColumns = useMemo<ColumnType[]>(() => {
        if (!ticketsData) {
            return COLUMN_DEFINITIONS.map(col => ({ ...col, items: [] }));
        }

        const grouped: Record<string, Ticket[]> = {};
        COLUMN_DEFINITIONS.forEach(col => { grouped[col.id] = []; });

        ticketsData.forEach((apiTicket: any) => {
            const columnId = STATUS_MAP[apiTicket.status] || 'open';
            const ticket: Ticket = {
                id: apiTicket.id,
                subject: apiTicket.subject,
                clientName: apiTicket.client?.name,
                priority: apiTicket.priority,
                description: apiTicket.description
            };
            if (grouped[columnId]) {
                grouped[columnId].push(ticket);
            }
        });

        return COLUMN_DEFINITIONS.map(col => ({
            ...col,
            items: grouped[col.id] || []
        }));
    }, [ticketsData]);

    const [columns, setColumns] = useState<ColumnType[]>(initialColumns);

    useEffect(() => {
        setColumns(initialColumns);
    }, [initialColumns]);

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            ticketService.update(id, { status }),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
        },
    });

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
        if (item) setActiveTicket(item);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

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
                if (c.id === activeContainer) {
                    return { ...c, items: activeItems.filter(i => i.id !== active.id) };
                }
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
            });
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const overContainer = findContainer(over?.id || '');

        if (
            activeContainerId &&
            overContainer &&
            activeContainerId !== overContainer
        ) {
            const newStatus = REVERSE_STATUS_MAP[overContainer];
            if (newStatus) {
                updateStatusMutation.mutate({
                    id: active.id as number,
                    status: newStatus
                });
            }
        }

        setActiveId(null);
        setActiveTicket(null);
        setActiveContainerId(null);
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: { opacity: '0.5' },
            },
        }),
    };

    if (isLoading && !ticketsData) return <PageWrapper><CircularProgress /></PageWrapper>;

    return (
        <PageWrapper>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Tickets</Typography>
                    <Typography variant="body1" color="text.secondary">Manage support tickets visually.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => router.push('/tickets/new')}>
                    New Ticket
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
                    {activeTicket ? (
                        <Card sx={{ width: 280, cursor: 'grabbing', boxShadow: 5 }}>
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold">{activeTicket.subject}</Typography>
                            </CardContent>
                        </Card>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </PageWrapper>
    );
};

export default TicketsPage;
