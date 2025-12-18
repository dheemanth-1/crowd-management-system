import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/lib/socket';

export interface RealtimeEntry {
    personId: string;
    personName: string;
    gender?: string;
    zoneName: string;
    zoneId: string;
    siteName: string;
    siteId: string;
    entryTime: number | null;
    exitTime: number | null;
    dwellTime: number | null;
}

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

export const useRealtimeEntries = (siteId: string | undefined) => {
    const [entries, setEntries] = useState<Map<string, RealtimeEntry>>(new Map());
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!siteId) return;

        const socket = getSocket();
        if (!socket) return;

        const handleAlert = (data: AlertEvent) => {
            console.log('📨 Alert event received:', data);

            if (data.siteId !== siteId) return;

            setEntries((prevEntries) => {
                const newEntries = new Map(prevEntries);
                const existingEntry = newEntries.get(data.personId);

                if (data.direction === 'entry' || data.direction === 'zone-entry') {

                    if (existingEntry) {
                        newEntries.set(data.personId, {
                            ...existingEntry,
                            entryTime: data.ts,
                            exitTime: null,
                            dwellTime: null,
                            zoneName: data.zoneName,
                            zoneId: data.zoneId,
                        });
                    } else {
                        newEntries.set(data.personId, {
                            personId: data.personId,
                            personName: data.personName,
                            gender: data.gender,
                            zoneName: data.zoneName,
                            zoneId: data.zoneId,
                            siteName: data.siteName,
                            siteId: data.siteId,
                            entryTime: data.ts,
                            exitTime: null,
                            dwellTime: null,
                        });
                    }
                } else if (data.direction === 'exit' || data.direction === 'zone-exit') {

                    if (existingEntry && existingEntry.entryTime) {
                        const dwellTimeMs = data.ts - existingEntry.entryTime;
                        const dwellTimeMinutes = Math.round(dwellTimeMs / (1000 * 60));

                        newEntries.set(data.personId, {
                            ...existingEntry,
                            exitTime: data.ts,
                            dwellTime: dwellTimeMinutes,
                        });
                    } else {
                        newEntries.set(data.personId, {
                            personId: data.personId,
                            personName: data.personName,
                            gender: data.gender,
                            zoneName: data.zoneName,
                            zoneId: data.zoneId,
                            siteName: data.siteName,
                            siteId: data.siteId,
                            entryTime: null,
                            exitTime: data.ts,
                            dwellTime: null,
                        });
                    }
                }
                return newEntries;
            });
            queryClient.invalidateQueries({ queryKey: ['entries', siteId] });
        };

        socket.on('alert', handleAlert);

        return () => {
            socket.off('alert', handleAlert);
        };
    }, [siteId, queryClient]);

    return Array.from(entries.values());
};