'use client';

import React, { useState } from 'react';
import {
    Grid,
    Box,
    Typography,
    Paper,
    useTheme,
    useMediaQuery,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    AvatarGroup,
    LinearProgress,
    Chip,
    Tooltip,
    Fade
} from '@mui/material';
import {
    PeopleAlt,
    AttachMoney,
    AssignmentTurnedIn,
    TrendingUp,
    MoreVert,
    Refresh,
    FilterList,
    Download,
    CalendarToday,
    Notifications,
    Search,
    ArrowUpward,
    ArrowDownward,
    TrendingFlat,
    CheckCircle,
    Schedule,
    Visibility
} from '@mui/icons-material';
import PageWrapper from '@/components/common/PageWrapper';
import KPICard from '@/components/features/dashboard/KPICard';
import RevenueChart from '@/components/features/dashboard/RevenueChart';
import LeadsPieChart from '@/components/features/dashboard/LeadsPieChart';
import RecentActivities from '@/components/features/dashboard/RecentActivities';
import TeamLeaderboard from '@/components/features/dashboard/TeamLeaderboard';
import { useRealTimeStats } from '@/hooks/useRealTimeStats';

// Mock data for demonstration
const quickStats = [
    { label: 'Avg. Response Time', value: '2.4h', change: -0.5 },
    { label: 'Satisfaction Score', value: '4.8/5', change: 0.2 },
    { label: 'Active Projects', value: '8', change: 2 },
];

const DashboardPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [timeRange, setTimeRange] = useState('This Week');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleTimeRangeChange = (range: string) => {
        setTimeRange(range);
        handleMenuClose();
    };

    const realTimeStats = useRealTimeStats();

    // Mapping real-time stats to KPI cards
    const kpiData = [
        {
            title: "Total Leads",
            value: realTimeStats?.total_leads.toString() || "2,543",
            change: 12.5,
            icon: <PeopleAlt />,
            color: theme.palette.primary.main,
            trend: "up"
        },
        {
            title: "Total Revenue",
            value: realTimeStats ? `$${realTimeStats.total_revenue.toLocaleString()}` : "$45,200",
            change: 8.2,
            icon: <AttachMoney />,
            color: theme.palette.success.main,
            trend: "up"
        },
        {
            title: "Won Deals",
            value: realTimeStats?.won_deals.toString() || "12",
            change: -2.4,
            icon: <AssignmentTurnedIn />,
            color: theme.palette.warning.main,
            trend: "down"
        },
        {
            title: "Total Clients",
            value: realTimeStats?.total_clients.toString() || "150",
            change: 4.6,
            icon: <TrendingUp />,
            color: theme.palette.info.main,
            trend: "up"
        },
    ];

    return (
        <PageWrapper>
            {/* Enhanced Header with Actions */}
            <Box
                sx={{
                    mb: 4,
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: 2
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5
                        }}
                    >
                        Welcome back, Alex!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" component="span">
                        Here's what's happening with your business today
                        <Chip
                            label="Updated just now"
                            size="small"
                            color="success"
                            icon={<CheckCircle sx={{ fontSize: 14 }} />}
                            sx={{ ml: 2, fontSize: '0.75rem' }}
                        />
                    </Typography>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                        variant="outlined"
                        startIcon={<CalendarToday />}
                        onClick={handleMenuClick}
                        sx={{
                            borderRadius: 2,
                            borderColor: 'divider',
                            textTransform: 'none'
                        }}
                    >
                        {timeRange}
                    </Button>

                    <Tooltip title="Refresh data">
                        <IconButton
                            sx={{
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                    transform: 'rotate(45deg)',
                                    transition: 'transform 0.3s'
                                }
                            }}
                        >
                            <Refresh />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Export dashboard">
                        <IconButton
                            sx={{
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: 2
                            }}
                        >
                            <Download />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Filter view">
                        <IconButton
                            sx={{
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: 2
                            }}
                        >
                            <FilterList />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Time Range Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    {['Today', 'This Week', 'This Month', 'This Quarter', 'This Year'].map((range) => (
                        <MenuItem
                            key={range}
                            onClick={() => handleTimeRangeChange(range)}
                            selected={timeRange === range}
                        >
                            {range}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>

            {/* Quick Stats Bar */}
            <Fade in={true} timeout={1000}>
                <Paper
                    elevation={0}
                    sx={{
                        mb: 4,
                        p: 2,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                        border: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        justifyContent: 'space-around',
                        flexWrap: 'wrap',
                        gap: 2
                    }}
                >
                    {quickStats.map((stat, index) => (
                        <Box key={index} sx={{ textAlign: 'center', minWidth: 120 }}>
                            <Typography variant="caption" color="text.secondary">
                                {stat.label}
                            </Typography>
                            <Typography variant="h6" fontWeight={600}>
                                {stat.value}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                {stat.change > 0 ? (
                                    <ArrowUpward sx={{ fontSize: 14, color: 'success.main' }} />
                                ) : stat.change < 0 ? (
                                    <ArrowDownward sx={{ fontSize: 14, color: 'error.main' }} />
                                ) : (
                                    <TrendingFlat sx={{ fontSize: 14, color: 'warning.main' }} />
                                )}
                                <Typography
                                    variant="caption"
                                    color={stat.change > 0 ? 'success.main' : stat.change < 0 ? 'error.main' : 'warning.main'}
                                >
                                    {stat.change > 0 ? '+' : ''}{stat.change}%
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Paper>
            </Fade>


            {/* ... Header ... */}
            {/* Enhanced KPI Cards with Hover Effects */}
            <Grid container spacing={3} mb={4}>
                {kpiData.map((kpi, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <KPICard
                            {...kpi}
                            delay={index * 0.1}

                        />
                    </Grid>
                ))}
            </Grid>

            {/* Charts Section with Enhanced Header */}
            <Box mb={4}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}>
                    <Typography variant="h6" fontWeight={600}>
                        Performance Overview
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            size="small"
                            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                            onClick={() => setViewMode('grid')}
                            sx={{ borderRadius: 2 }}
                        >
                            Grid
                        </Button>
                        <Button
                            size="small"
                            variant={viewMode === 'list' ? 'contained' : 'outlined'}
                            onClick={() => setViewMode('list')}
                            sx={{ borderRadius: 2 }}
                        >
                            List
                        </Button>
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 6 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: `1px solid ${theme.palette.divider}`,
                                height: '100%',
                                '&:hover': {
                                    boxShadow: theme.shadows[4],
                                    transition: 'box-shadow 0.3s ease'
                                }
                            }}
                        >
                            <RevenueChart timeRange={timeRange} />
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: `1px solid ${theme.palette.divider}`,
                                height: '100%',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 4,
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                                }
                            }}
                        >
                            <LeadsPieChart />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {/* Team Activity Section */}
            <Box mb={4}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
                    }}
                >
                    <Typography variant="h6" fontWeight={600} mb={3}>
                        Team Activity
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <RecentActivities />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TeamLeaderboard />
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            {/* Bottom Section: Additional Insights */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            height: '100%'
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight={600}>
                                Recent Notifications
                            </Typography>
                            <Notifications color="action" />
                        </Box>
                        {[1, 2, 3].map((_, i) => (
                            <Box
                                key={i}
                                sx={{
                                    p: 2,
                                    mb: 1,
                                    borderRadius: 2,
                                    backgroundColor: i === 0 ? 'action.hover' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                        cursor: 'pointer'
                                    }
                                }}
                            >
                                <Avatar sx={{ width: 40, height: 40, bgcolor: theme.palette.primary.light }}>
                                    {['JD', 'AS', 'MJ'][i]}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" fontWeight={500}>
                                        New lead assigned
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        2 hours ago
                                    </Typography>
                                </Box>
                                <Chip
                                    label={i === 0 ? "New" : "Viewed"}
                                    size="small"
                                    color={i === 0 ? "primary" : "default"}
                                    variant="outlined"
                                />
                            </Box>
                        ))}
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            height: '100%'
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight={600}>
                                Top Performers
                            </Typography>
                            <AvatarGroup max={4} sx={{ justifyContent: 'flex-end' }}>
                                <Avatar alt="John Doe" src="/avatar1.jpg" />
                                <Avatar alt="Jane Smith" src="/avatar2.jpg" />
                                <Avatar alt="Mike Johnson" src="/avatar3.jpg" />
                                <Avatar alt="Sarah Williams" src="/avatar4.jpg" />
                            </AvatarGroup>
                        </Box>
                        {[
                            { name: 'John Doe', role: 'Sales Manager', value: '$12,450', progress: 90 },
                            { name: 'Jane Smith', role: 'Marketing Lead', value: '$8,920', progress: 75 },
                            { name: 'Mike Johnson', role: 'Account Executive', value: '$6,750', progress: 60 },
                        ].map((person, index) => (
                            <Box key={index} sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Box>
                                        <Typography variant="body2" fontWeight={500}>
                                            {person.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {person.role}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" fontWeight={600}>
                                        {person.value}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={person.progress}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: theme.palette.action.hover,
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 3,
                                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                                        }
                                    }}
                                />
                            </Box>
                        ))}
                    </Paper>
                </Grid>
            </Grid>

            {/* Floating Action Button for Mobile */}
            {isMobile && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        zIndex: 1000
                    }}
                >
                    <Tooltip title="Quick actions">
                        <IconButton
                            sx={{
                                width: 56,
                                height: 56,
                                backgroundColor: theme.palette.primary.main,
                                color: 'white',
                                boxShadow: theme.shadows[8],
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                    transform: 'scale(1.1)',
                                    transition: 'transform 0.3s'
                                }
                            }}
                        >
                            <MoreVert />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
        </PageWrapper>
    );
};

export default DashboardPage;