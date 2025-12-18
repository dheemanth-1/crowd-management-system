'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDemographicsTimeseries } from '@/lib/hooks/useDashboard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

export function DemographicsAnalysisChart() {
    const { data, isLoading, isError } = useDemographicsTimeseries();

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Demographics Analysis</CardTitle>
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
                    <CardTitle>Demographics Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80 flex items-center justify-center">
                        <p className="text-red-500">Error loading chart data</p>
                    </div>
                </CardContent>
            </Card>
        );
    }


    const chartData = Array.isArray(data)
        ? data.map((bucket) => ({
            time: format(new Date(bucket.utc), 'HH:mm'),
            male: bucket.male,
            female: bucket.female,
        }))
        : [];


    if (chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Demographics Analysis</CardTitle>
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
                <CardTitle>Demographics Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={chartData}>
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
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="line"
                        />
                        <Line
                            type="monotone"
                            dataKey="male"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Male"
                            dot={{ fill: '#3b82f6', r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="female"
                            stroke="#ec4899"
                            strokeWidth={2}
                            name="Female"
                            dot={{ fill: '#ec4899', r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}