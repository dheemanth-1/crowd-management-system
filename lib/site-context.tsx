'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface Zone {
    zoneId: string;
    name: string;
    securityLevel: string;
}

interface Site {
    siteId: string;
    name: string;
    city: string;
    country: string;
    timezone: string;
    zones: Zone[];
}

interface SiteContextType {
    sites: Site[];
    selectedSite: Site | null;
    setSelectedSite: (site: Site) => void;
    isLoading: boolean;
    error: Error | null;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);

    // Fetch sites from API
    const { data: sites = [], isLoading, error } = useQuery<Site[]>({
        queryKey: ['sites'],
        queryFn: async () => {
            const data = await api.get('/sites');
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes - sites don't change often
    });

    // Auto-select first site when sites are loaded
    useEffect(() => {
        if (sites.length > 0 && !selectedSite) {
            setSelectedSite(sites[0]);
        }
    }, [sites, selectedSite]);

    return (
        <SiteContext.Provider
            value={{
                sites,
                selectedSite,
                setSelectedSite,
                isLoading,
                error: error as Error | null,
            }}
        >
            {children}
        </SiteContext.Provider>
    );
}

export function useSite() {
    const context = useContext(SiteContext);
    if (context === undefined) {
        throw new Error('useSite must be used within a SiteProvider');
    }
    return context;
}