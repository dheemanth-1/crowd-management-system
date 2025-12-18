'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {useDemographics, useDemographicsTimeseries} from '@/lib/hooks/useDashboard';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
    male: '#3b82f6',
    female: '#ec4899',
};

export function DemographicsChart() {
    const demographics = useDemographics();
    const lastBucket = demographics.data?.buckets[demographics.data?.buckets.length - 1];

    if (demographics.isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Demographics Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80 flex items-center justify-center">
                        <p className="text-gray-400">Loading chart...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (demographics.isError) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Demographics Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80 flex items-center justify-center">
                        <p className="text-red-500">Error loading chart data</p>
                    </div>
                </CardContent>
            </Card>
        );
    }


    let maleCount = 0;
    let femaleCount = 0;

    if (demographics.data && lastBucket) {

        if (typeof lastBucket.male === 'number' && typeof lastBucket.female === 'number') {
            maleCount = lastBucket.male;
            femaleCount = lastBucket.female;
        }

    }



    // Check if we have valid data
    const totalCount = maleCount + femaleCount;

    if (totalCount === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Demographics Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80 flex items-center justify-center">
                        <p className="text-gray-400">No data available</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const chartData = [
        { name: 'Male', value: maleCount },
        { name: 'Female', value: femaleCount },
    ];

    const malePercentage = Math.round((maleCount / totalCount) * 100);
    const femalePercentage = Math.round((femaleCount / totalCount) * 100);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Demographics Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => {
                                const percentage = Math.round((value / totalCount) * 100);
                                return `${name}: ${percentage}%`;
                            }}
                            innerRadius="60%"
                            outerRadius="80%"
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.name === 'Male' ? COLORS.male : COLORS.female}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => {
                                const percentage = Math.round((value / totalCount) * 100);
                                return [`${value} (${percentage}%)`, ''];
                            }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>

                {/* Summary Stats Below Chart */}
                {/*<div className="flex justify-center gap-8 mt-4 pt-4 border-t">*/}
                {/*    <div className="text-center">*/}
                {/*        <div className="flex items-center justify-center gap-2">*/}
                {/*            <div className="w-3 h-3 rounded-full bg-blue-600"></div>*/}
                {/*            <p className="text-sm font-medium text-gray-600">Male</p>*/}
                {/*        </div>*/}
                {/*        <p className="text-2xl font-bold text-blue-600 mt-1">{maleCount}</p>*/}
                {/*        <p className="text-xs text-gray-500">{malePercentage}%</p>*/}
                {/*    </div>*/}
                {/*    <div className="text-center">*/}
                {/*        <div className="flex items-center justify-center gap-2">*/}
                {/*            <div className="w-3 h-3 rounded-full bg-pink-600"></div>*/}
                {/*            <p className="text-sm font-medium text-gray-600">Female</p>*/}
                {/*        </div>*/}
                {/*        <p className="text-2xl font-bold text-pink-600 mt-1">{femaleCount}</p>*/}
                {/*        <p className="text-xs text-gray-500">{femalePercentage}%</p>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </CardContent>
        </Card>
    );
}