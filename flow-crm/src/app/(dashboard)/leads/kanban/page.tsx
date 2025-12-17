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
import { Box, Typography, Card, CardContent, Stack, Avatar, Chip, useTheme, IconButton, CircularProgress } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import PageWrapper from '@/components/common/PageWrapper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService, Lead as ApiLead } from '@/services/leadService';

// --- Types ---

type Lead = {
    id: number;
    name: string;
    company?: string;
    value: number;
};

type ColumnType = {
    id: string;
    title: string;
    items: Lead[];
    color: string;
};

// Status mapping from database to kanban columns
const STATUS_MAP: Record<string, string> = {
    'NEW': 'new',
    'CONTACTED': 'contacted',
    'QUALIFIED': 'qualified',
    'PROPOSAL SENT': 'proposal',
    'WON': 'won',
    'LOST': 'lost'
};

const REVERSE_STATUS_MAP: Record<string, string> = {
    'new': 'NEW',
    'contacted': 'CONTACTED',
    'qualified': 'QUALIFIED',
    'proposal': 'PROPOSAL SENT',
    'won': 'WON',
    'lost': 'LOST'
};

const COLUMN_DEFINITIONS: Omit<ColumnType, 'items'>[] = [
    { id: 'new', title: 'New', color: '#3b82f6' },
    { id: 'contacted', title: 'Contacted', color: '#eab308' },
    { id: 'qualified', title: 'Qualified', color: '#ec4899' },
    { id: 'proposal', title: 'Proposal Sent', color: '#8b5cf6' },
    { id: 'won', title: 'Won', color: '#22c55e' },
    { id: 'lost', title: 'Lost', color: '#ef4444' },
];

// Format value as currency
const formatValue = (value: number): string => {
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
};

// --- Components ---

const SortableLeadCard = ({ lead }: { lead: Lead }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: lead.id, data: { ...lead } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
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
                    <Typography variant="subtitle2" fontWeight="bold">{lead.company || 'No Company'}</Typography>
                    <IconButton size="small"><MoreHoriz fontSize="small" /></IconButton>
                </Stack>
                <Typography variant="body2" color="text.secondary" gutterBottom>{lead.name}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                    <Chip label={formatValue(lead.value)} size="small" color="primary" variant="outlined" />
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{lead.name.charAt(0)}</Avatar>
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
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    },
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none'
                }}>
                    {col.items.map((lead) => (
                        <SortableLeadCard key={lead.id} lead={lead} />
                    ))}
                </Box>
            </SortableContext>
        </Box>
    );
};


const KanbanBoard = () => {
    const queryClient = useQueryClient();
    const [activeId, setActiveId] = useState<number | null>(null);
    const [activeContainerId, setActiveContainerId] = useState<string | null>(null);
    const [activeLead, setActiveLead] = useState<Lead | null>(null);

    // Fetch leads from API
    const { data: leadsData, isLoading, error } = useQuery({
        queryKey: ['leads'],
        queryFn: leadService.getAll
    });

    // Transform API data into kanban columns
    const initialColumns = useMemo<ColumnType[]>(() => {
        if (!leadsData) {
            return COLUMN_DEFINITIONS.map(col => ({ ...col, items: [] }));
        }

        // Group leads by status
        const groupedLeads: Record<string, Lead[]> = {};
        COLUMN_DEFINITIONS.forEach(col => {
            groupedLeads[col.id] = [];
        });

        leadsData.forEach((apiLead: ApiLead) => {
            const columnId = STATUS_MAP[apiLead.status.toUpperCase()] || 'new';
            const lead: Lead = {
                id: apiLead.id,
                name: apiLead.name,
                company: apiLead.company,
                value: apiLead.value
            };
            if (groupedLeads[columnId]) {
                groupedLeads[columnId].push(lead);
            }
        });

        return COLUMN_DEFINITIONS.map(col => ({
            ...col,
            items: groupedLeads[col.id] || []
        }));
    }, [leadsData]);

    const [columns, setColumns] = useState<ColumnType[]>(initialColumns);

    // Sync local state with API data when it changes
    useEffect(() => {
        setColumns(initialColumns);
    }, [initialColumns]);

    // Mutation to update lead status with Optimistic UI
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            leadService.updateStatus(id, status),

        onMutate: async ({ id, status }) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['leads'] });

            // Snapshot the previous value
            const previousLeads = queryClient.getQueryData<ApiLead[]>(['leads']);

            // Optimistically update to the new value
            if (previousLeads) {
                queryClient.setQueryData<ApiLead[]>(['leads'], (old) => {
                    if (!old) return [];
                    return old.map(lead =>
                        lead.id === id ? { ...lead, status: REVERSE_STATUS_MAP[status] || status } : lead
                    );
                });
            }

            // Return a context object with the snapshotted value
            return { previousLeads };
        },

        onError: (err, newTodo, context) => {
            // If the mutation fails, roll back
            if (context?.previousLeads) {
                queryClient.setQueryData(['leads'], context.previousLeads);
            }
        },

        onSettled: () => {
            // Always refetch after error or success:
            queryClient.invalidateQueries({ queryKey: ['leads'] });
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
        if (item) setActiveLead(item);
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
                // We're dragging over the column itself (empty or not)
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
            // Update status in backend
            const newStatus = REVERSE_STATUS_MAP[overContainer];
            if (newStatus) {
                updateStatusMutation.mutate({
                    id: active.id as number,
                    status: newStatus
                });
            }
        }

        setActiveId(null);
        setActiveLead(null);
        setActiveContainerId(null);
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    if (isLoading && !leadsData) {
        return (
            <PageWrapper>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </PageWrapper>
        );
    }

    if (error) {
        return (
            <PageWrapper>
                <Box mb={4}>
                    <Typography variant="h4" fontWeight={700}>Leads Pipeline</Typography>
                    <Typography variant="body1" color="error">Error loading leads. Please try again.</Typography>
                </Box>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Box mb={4}>
                <Typography variant="h4" fontWeight={700}>Leads Pipeline</Typography>
                <Typography variant="body1" color="text.secondary">Drag and drop to update lead status.</Typography>
            </Box>

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
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    },
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none'
                }}>
                    {columns.map((col) => (
                        <KanBanColumn key={col.id} col={col} />
                    ))}
                </Box>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeLead ? (
                        <Card sx={{ width: 280, cursor: 'grabbing', boxShadow: 5 }}>
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold">{activeLead.company || 'No Company'}</Typography>
                                <Typography variant="body2">{activeLead.name}</Typography>
                            </CardContent>
                        </Card>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </PageWrapper>
    );
};

export default KanbanBoard;
