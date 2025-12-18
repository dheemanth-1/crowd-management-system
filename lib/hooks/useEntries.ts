import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useSite } from '@/lib/site-context';
import { getStartOfDayUtc, getCurrentUtc } from '@/lib/utils/time';
import { usePersonGenderMap } from './useDemographics';

export interface Entry {
    personId: string;
    personName: string;
    zoneId: string;
    zoneName: string;
    severity: string;
    entryUtc: number;
    entryLocal: string;
    exitUtc: number;
    exitLocal: string;
    dwellMinutes: number;
    gender?: string;
}

interface EntriesApiResponse {
    siteId: string;
    totalRecords: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    records: Entry[];
}

export const useEntries = (page: number = 1, pageSize: number = 25) => {
    const { selectedSite } = useSite();
    const { data: genderMap } = usePersonGenderMap();

    return useQuery<EntriesApiResponse>({
        queryKey: ['entries', selectedSite?.siteId, page, pageSize],
        queryFn: async () => {
            if (!selectedSite) throw new Error('No site selected');

            console.log('Fetching Entries for site:', selectedSite.name);

            const requestBody = {
                siteId: selectedSite.siteId,
                fromUtc: getStartOfDayUtc(),
                toUtc: getCurrentUtc(),
                pageSize: pageSize,
                pageNumber: page,
            };

            const response: EntriesApiResponse = await api.post(
                '/analytics/entry-exit',
                requestBody
            );


            if (genderMap && response.records) {
                response.records = response.records.map(entry => ({
                    ...entry,
                    gender: genderMap.get(entry.personId) || undefined,
                }));
            }


            return response;
        },
        enabled: !!selectedSite,
        placeholderData: (prev) => prev,
        staleTime: 30000,
        refetchInterval: 60000,

    });
};