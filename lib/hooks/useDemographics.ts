import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useSite } from '@/lib/site-context';
import { getStartOfDayUtc, getCurrentUtc } from '@/lib/utils/time';

interface DemographicsBucket {
    utc: number;
    local: string;
    male: number;
    female: number;
}

interface DemographicsApiResponse {
    siteId: string;
    fromUtc: number;
    toUtc: number;
    timezone: string;
    buckets: DemographicsBucket[];

    records?: Array<{
        personId: string;
        personName: string;
        gender: string;
        timestamp: number;
    }>;
}

export const usePersonGenderMap = () => {
    const { selectedSite } = useSite();

    return useQuery<Map<string, string>>({
        queryKey: ['person-gender-map', selectedSite?.siteId],
        queryFn: async () => {
            if (!selectedSite) return new Map();

            const response: DemographicsApiResponse = await api.post('/analytics/demographics', {
                siteId: selectedSite.siteId,
                fromUtc: getStartOfDayUtc(),
                toUtc: getCurrentUtc(),
            });

            const genderMap = new Map<string, string>();


            if (response.records && Array.isArray(response.records)) {
                response.records.forEach(record => {
                    if (record.personId && record.gender) {
                        genderMap.set(record.personId, record.gender);
                    }
                });
            }

            return genderMap;
        },
        enabled: !!selectedSite,
        staleTime: 5 * 60 * 1000,

    });
};