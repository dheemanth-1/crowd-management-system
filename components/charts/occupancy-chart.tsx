'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOccupancyTimeseries } from '@/lib/hooks/useDashboard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export function OccupancyChart() {
    const { data, isLoading, isError } = useOccupancyTimeseries();

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Occupancy Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80 flex items-center justify-center">
                        <p className="text-gray-400">Loading chart...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Occupancy Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80 flex items-center justify-center">
                        <p className="text-red-500">Error loading chart data</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Transform buckets data for the chart
    const chartData = Array.isArray(data)
        ? data.map((bucket) => ({
            time: format(new Date(bucket.utc), 'HH:mm'),
            count: Math.round(bucket.avg),
        }))
        : [];

    // Show empty state if no data
    if (chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Occupancy Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80 flex items-center justify-center">
                        <p className="text-gray-400">No data available</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Occupancy Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="time"
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorOccupancy)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}