'use client';

import { useSite } from '@/lib/site-context';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MapPin } from 'lucide-react';

export function SiteSelector() {
    const { sites, selectedSite, setSelectedSite, isLoading } = useSite();

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Loading sites...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-600" />
            <Select
                value={selectedSite?.siteId}
                onValueChange={(siteId) => {
                    const site = sites.find((s) => s.siteId === siteId);
                    if (site) setSelectedSite(site);
                }}
            >
                <SelectTrigger className="w-[300px] bg-white">
                    <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent>
                    {sites.map((site) => (
                        <SelectItem key={site.siteId} value={site.siteId}>
                            <div className="flex flex-col">
                                <span className="font-medium">{site.name}</span>
                                <span className="text-xs text-gray-500">
                  {site.city}, {site.country}
                </span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
