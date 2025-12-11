import { useEffect, useState } from 'react';
import { echo } from '@/lib/echo';

interface DashboardStats {
    total_leads: number;
    total_clients: number;
    total_revenue: number;
    won_deals: number;
}

export const useRealTimeStats = (initialStats?: DashboardStats) => {
    const [stats, setStats] = useState<DashboardStats | undefined>(initialStats);

    useEffect(() => {
        if (!echo) return;

        const channel = echo.channel('dashboard');

        channel.listen('DashboardStatsUpdated', (e: { stats: DashboardStats }) => {
            console.log('Real-time stats received:', e.stats);
            setStats(e.stats);
        });

        return () => {
            channel.stopListening('DashboardStatsUpdated');
            echo.leave('dashboard');
        };
    }, []);

    return stats;
};
