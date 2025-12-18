import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { initSocket, disconnectSocket } from '@/lib/socket';


interface AlertEvent {
    ts: number;
    eventId: string;
    direction: 'entry' | 'exit' | 'zone-entry' | 'zone-exit';
    personName: string;
    personId: string;
    severity: 'low' | 'medium' | 'high';
    zoneName: string;
    zoneId: string;
    siteName: string;
    siteId: string;
    gender?: string;
}

interface LiveOccupancyEvent {
    ts: number;
    siteId: string;
    siteOccupancy: number;
    zoneId: string;
    zoneOccupancy: number;
}

export const useSocket = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const socket = initSocket();
        if (!socket) return;


        // Alert Events (Entry/Exit)
        socket.on('alert', (data: AlertEvent) => {
            console.log('Alert event received:', data);

            // Update footfall count based on direction
            if (data.direction === 'entry') {
                queryClient.setQueryData(
                    ['footfall', data.siteId],
                    (old: any) => {
                        if (!old) return old;
                        return {
                            ...old,
                            footfall: old.footfall + 1,
                        };
                    }
                );
            }

            // Invalidate entries to trigger refetch which will fetch updated data from the analytics API
            queryClient.invalidateQueries({
                queryKey: ['entries', data.siteId]
            });


        });


        // Live Occupancy Updates
        socket.on('live_occupancy', (data: LiveOccupancyEvent) => {
            console.log('Live occupancy update:', data);


            queryClient.setQueryData(
                ['live-occupancy', data.siteId],
                (old: any) => ({
                    ...old,
                    currentOccupancy: data.siteOccupancy,
                    lastUpdated: data.ts,
                })
            );

            // Optionally invalidate time series for chart updates
            // Only if occupancy change is significant
            if (Math.random() < 0.1) {  // Update chart 10% of the time to reduce calls
                queryClient.invalidateQueries({
                    queryKey: ['occupancy-timeseries', data.siteId]
                });
            }
        });


        socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
        });

        socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
        });

        return () => {
            disconnectSocket();
        };
    }, [queryClient]);
};