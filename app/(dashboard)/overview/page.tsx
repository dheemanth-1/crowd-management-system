'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useDemographics, useDwellTime, useFootfall, useLiveOccupancy} from '@/lib/hooks/useDashboard';
import {OccupancyChart} from '@/components/charts/occupancy-chart';
import {DemographicsChart} from '@/components/charts/demographics-chart';
import {Clock, TrendingUp, Users} from 'lucide-react';
import {DemographicsAnalysisChart} from "@/components/charts/demographics-analysis-chart";

export default function OverviewPage() {
    const liveOccupancy = useLiveOccupancy();
    const dwellTime = useDwellTime();
    const footfall = useFootfall();

    function convertToMinSec(decimalMinutes: number): string {
        const minutes = Math.floor(decimalMinutes);

        let seconds = Math.round((decimalMinutes - minutes) * 60);

        if (seconds === 60) {
            seconds = 0;
            return `${minutes + 1} min ${seconds} sec`;
        }

        return `${minutes} min ${seconds} sec`;
    }


    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Overview Dashboard</h1>
                    <p className="text-gray-600 mt-1">Real-time crowd analytics and insights</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Live Occupancy */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Live Occupancy
                            </CardTitle>
                            <Users className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            {liveOccupancy.isLoading && (
                                <p className="text-2xl font-bold text-gray-400">Loading...</p>
                            )}
                            {liveOccupancy.isError && (
                                <p className="text-sm text-red-500">Error loading data</p>
                            )}
                            {liveOccupancy.data && (
                                <div>
                                    <p className="text-3xl font-medium text-black">
                                        {liveOccupancy.data.currentOccupancy}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        People
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Today's Footfall */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Today's Footfall
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            {footfall.isLoading && (
                                <p className="text-2xl font-bold text-gray-400">Loading...</p>
                            )}
                            {footfall.isError && (
                                <p className="text-sm text-red-500">Error loading data</p>
                            )}
                            {footfall.data && (
                                <div>
                                    <p className="text-3xl font-medium text-black">
                                        {footfall.data.footfall.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Total visitors today
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>


                    {/* Average Dwell Time */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Average Dwell Time
                            </CardTitle>
                            <Clock className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            {dwellTime.isLoading && (
                                <p className="text-2xl font-bold text-gray-400">Loading...</p>
                            )}
                            {dwellTime.isError && (
                                <p className="text-sm text-red-500">Error loading data</p>
                            )}
                            {dwellTime.data && (
                                <div>
                                    <p className="text-3xl font-medium text-black">
                                        {convertToMinSec(dwellTime.data.avgDwellMinutes)}
                                    </p>

                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* First Row - Occupancy Chart (Full Width) */}
                <div>
                    <OccupancyChart />
                </div>

                {/* Second Row - Demographics Charts (Side by Side) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Demographics Pie - 1/3 width */}
                    <div className="lg:col-span-1">
                         <DemographicsChart />
                    </div>

                    {/* Demographics Analysis Line Chart - 2/3 width */}
                    <div className="lg:col-span-2">
                        <DemographicsAnalysisChart />
                    </div>
                </div>
            </div>
        </div>
    );
}
