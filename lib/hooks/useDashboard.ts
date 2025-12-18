import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/api';
import {useSite} from '@/lib/site-context';
import {getCurrentUtc, getStartOfDayUtc} from '@/lib/utils/time';

interface FootfallApiResponse {
    siteId: string;
    fromUtc: number;
    toUtc: number;
    footfall: number;
}



interface OccupancyBucket {
    utc: number;
    local: string;
    avg: number;
}

interface OccupancyResponse {
    siteId: string;
    fromUtc: number;
    toUtc: number;
    timezone: string;
    buckets: OccupancyBucket[];
}

interface DwellTimeResponse {
    siteId: string;
    fromUtc: number;
    toUtc: number;
    avgDwellMinutes: number;
    dwellRecords: number;
}



interface DemographicsResponse {
    siteId: string;
    fromUtc: number;
    toUtc: number;
    timezone: string;
    buckets: DemographicsBucket[];
}

interface LiveOccupancyResponse {
    currentOccupancy: number;
    capacity?: number;
    zone?: string;
}

interface DemographicsBucket {
    utc: number;
    local: string;
    male: number;
    female: number;
}

interface DemographicsTimeseriesApiResponse {
    siteId: string;
    fromUtc: number;
    toUtc: number;
    timezone: string;
    buckets: DemographicsBucket[];
}



function createRequestBody(siteId: string, fromUtc?: number, toUtc?: number) {
    return {
        siteId,
        fromUtc: fromUtc || getStartOfDayUtc(),
        toUtc: toUtc || getCurrentUtc(),
    };
}

export const useLiveOccupancy = () => {
    const { selectedSite } = useSite();

    return useQuery<LiveOccupancyResponse>({
        queryKey: ['live-occupancy', selectedSite?.siteId],
        queryFn: async () => {
            if (!selectedSite) throw new Error('No site selected');

            const body = createRequestBody(selectedSite.siteId);
            const response = await api.post('/analytics/occupancy', body);

            if (response.buckets && Array.isArray(response.buckets) && response.buckets.length > 0) {
                const latestBucket = response.buckets[response.buckets.length - 1];
                return {
                    currentOccupancy: Math.round(latestBucket.avg),
                };
            }


            return {
                currentOccupancy: response.currentOccupancy || 0,
                capacity: response.capacity,
                zone: response.zone,
            };
        },
        enabled: !!selectedSite,
        refetchInterval: 30000,
    });
};

export const useDwellTime = () => {
    const { selectedSite } = useSite();

    return useQuery<DwellTimeResponse>({
        queryKey: ['dwell-time', selectedSite?.siteId],
        queryFn: async () => {
            if (!selectedSite) throw new Error('No site selected');

            const body = createRequestBody(selectedSite.siteId);
            return await api.post('/analytics/dwell', body);
        },
        enabled: !!selectedSite,
        refetchInterval: 30000,
    });
};

export const useFootfall = () => {
    const { selectedSite } = useSite();

    return useQuery<FootfallApiResponse>({
        queryKey: ['footfall', selectedSite?.siteId],
        queryFn: async () => {
            if (!selectedSite) throw new Error('No site selected');

            const todayBody = createRequestBody(selectedSite.siteId);
            const todayResponse: FootfallApiResponse = await api.post('/analytics/footfall', todayBody);

            return todayResponse;
        },
        enabled: !!selectedSite,
        refetchInterval: 30000,
    });
};

export const useOccupancyTimeseries = () => {
    const { selectedSite } = useSite();

    return useQuery<OccupancyBucket[]>({
        queryKey: ['occupancy-timeseries', selectedSite?.siteId],
        queryFn: async () => {
            if (!selectedSite) throw new Error('No site selected');

            const body = createRequestBody(selectedSite.siteId);
            const response: OccupancyResponse = await api.post('/analytics/occupancy', body);

            return response.buckets || [];
        },
        enabled: !!selectedSite,
        refetchInterval: 30000,
    });
};

export const useDemographics = () => {
    const { selectedSite } = useSite();

    return useQuery<DemographicsResponse>({
        queryKey: ['demographics', selectedSite?.siteId],
        queryFn: async () => {
            if (!selectedSite) throw new Error('No site selected');

            const body = createRequestBody(selectedSite.siteId);
            const data = await api.post('/analytics/demographics', body);

            return data;
        },
        enabled: !!selectedSite,
        refetchInterval: 30000,
    });
};

export const useDemographicsTimeseries = () => {
    const { selectedSite } = useSite();

    return useQuery<DemographicsBucket[]>({
        queryKey: ['demographics-timeseries', selectedSite?.siteId],
        queryFn: async () => {
            if (!selectedSite) throw new Error('No site selected');

            const body = createRequestBody(selectedSite.siteId);
            const response: DemographicsTimeseriesApiResponse = await api.post('/analytics/demographics', body);

            return response.buckets || [];
        },
        enabled: !!selectedSite,
        refetchInterval: 30000,
    });
};
