'use client';

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import PageWrapper from '@/components/common/PageWrapper';

const events = [
    { title: 'Meeting with Client A', start: new Date().toISOString().split('T')[0] + 'T10:00:00', end: new Date().toISOString().split('T')[0] + 'T11:00:00', backgroundColor: '#3b82f6' },
    { title: 'Project Deadline', start: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], backgroundColor: '#ef4444' },
    { title: 'Team Lunch', start: new Date().toISOString().split('T')[0] + 'T13:00:00', backgroundColor: '#10b981' }
];

const CalendarPage = () => {

    return (
        <PageWrapper>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Calendar</Typography>
                    <Typography variant="body1" color="text.secondary">Schedule and events.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />}>
                    Add Event
                </Button>
            </Stack>

            <Paper sx={{ p: 3, '& .fc': { fontFamily: 'inherit' } }}>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    events={events}
                    eventClick={(info) => {
                        alert('Event: ' + info.event.title);
                    }}
                    height="75vh"
                />
            </Paper>
        </PageWrapper>
    );
};

export default CalendarPage;
