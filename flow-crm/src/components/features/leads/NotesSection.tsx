'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    IconButton,
    CircularProgress,
    Alert,
    Avatar,
    Stack
} from '@mui/material';
import { Delete, Send } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noteService } from '@/services/noteService';
import { formatDistanceToNow } from 'date-fns';

interface NotesSectionProps {
    leadId: number;
}

const NotesSection = ({ leadId }: NotesSectionProps) => {
    const [newNote, setNewNote] = useState('');
    const queryClient = useQueryClient();

    const { data: notes, isLoading } = useQuery({
        queryKey: ['notes', leadId],
        queryFn: () => noteService.getForLead(leadId)
    });

    const createMutation = useMutation({
        mutationFn: (content: string) => noteService.create(leadId, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes', leadId] });
            setNewNote('');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: noteService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes', leadId] });
        }
    });

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (newNote.trim()) {
            createMutation.mutate(newNote);
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
                Notes
            </Typography>

            {/* Add Note Form */}
            <Box component="form" onSubmit={handleAddNote} sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    disabled={createMutation.isPending}
                    sx={{ mb: 2 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    startIcon={createMutation.isPending ? <CircularProgress size={20} /> : <Send />}
                    disabled={!newNote.trim() || createMutation.isPending}
                >
                    Add Note
                </Button>
            </Box>

            {/* Notes List */}
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : notes && notes.length > 0 ? (
                <Stack spacing={2}>
                    {notes.map((note) => (
                        <Paper
                            key={note.id}
                            elevation={0}
                            sx={{
                                p: 2,
                                bgcolor: 'background.default',
                                borderRadius: 2
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar sx={{ width: 32, height: 32 }}>
                                        {note.user.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>
                                            {note.user.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={() => deleteMutation.mutate(note.id)}
                                    disabled={deleteMutation.isPending}
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Box>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                {note.content}
                            </Typography>
                        </Paper>
                    ))}
                </Stack>
            ) : (
                <Alert severity="info">No notes yet. Add the first note above!</Alert>
            )}

            {createMutation.isError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    Failed to add note. Please try again.
                </Alert>
            )}
        </Paper>
    );
};

export default NotesSection;
