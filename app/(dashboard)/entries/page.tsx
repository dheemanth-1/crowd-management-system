'use client';

import { useState } from 'react';
import { useEntries } from '@/lib/hooks/useEntries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export default function EntriesPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const { data, isLoading, isError, error, refetch, isFetching } = useEntries(page, pageSize);

    const formatTime = (utcTimestamp: number): string => {
        if (!utcTimestamp || utcTimestamp === 0) return '--';

        try {
            return format(new Date(utcTimestamp), 'MMM dd, yyyy HH:mm:ss');
        } catch (error) {
            console.error('Error formatting time:', utcTimestamp, error);
            return '--';
        }
    };


    const formatDwellTime = (dwellMinutes: number): string => {
        if (!dwellMinutes || dwellMinutes === 0) return '--';

        const hours = Math.floor(dwellMinutes / 60);
        const minutes = Math.round(dwellMinutes % 60);

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };


    const getSeverityColor = (severity: string): string => {
        switch (severity?.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };


    const isStillInside = (exitUtc: number): boolean => {
        return !exitUtc || exitUtc === 0;
    };


    const entries = data?.records ?? [];
    const totalPages = data?.totalPages ?? 1;
    const totalEntries = data?.totalRecords ?? 0;
    const currentPage = data?.pageNumber ?? page;
    const currentPageSize = data?.pageSize ?? pageSize;

    const startEntry = totalEntries > 0 ? ((currentPage - 1) * currentPageSize) + 1 : 0;
    const endEntry = totalEntries > 0 ? Math.min(currentPage * currentPageSize, totalEntries) : 0;

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Crowd Entries</h1>
                        <p className="text-gray-600 mt-1">
                            Real-time visitor entry and exit records
                        </p>
                    </div>

                    {/* Refresh Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                        {isFetching ? 'Refreshing...' : 'Refresh'}
                    </Button>
                </div>

                {/* Entries Table Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Visitor Records</CardTitle>
                        {data && totalEntries > 0 && (
                            <div className="text-sm text-gray-600">
                                Total: {totalEntries.toLocaleString()} entries
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                                    <p className="text-gray-400">Loading entries...</p>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <p className="text-red-500 mb-2">Error loading entries</p>
                                    <p className="text-sm text-gray-500">{error?.message || 'Unknown error occurred'}</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => refetch()}
                                        className="mt-4"
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Table */}
                        {!isLoading && !isError && (
                            <>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[200px]">Visitor Name</TableHead>
                                                <TableHead className="w-[200px]">Zone</TableHead>
                                                <TableHead className="w-[100px]">Severity</TableHead>
                                                <TableHead className="w-[200px]">Entry Time</TableHead>
                                                <TableHead className="w-[200px]">Exit Time</TableHead>
                                                <TableHead className="w-[120px]">Dwell Time</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {entries.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                                        <div>
                                                            <p className="text-lg font-medium mb-1">No entries found</p>
                                                            <p className="text-sm">Try adjusting your filters or date range</p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                entries.map((entry, index) => (
                                                    <TableRow
                                                        key={entry.personId || `entry-${index}`}
                                                        className="hover:bg-gray-50 transition-colors"
                                                    >
                                                        {/* Visitor Name */}
                                                        <TableCell className="font-medium">
                                                            {entry.personName || 'Unknown'}
                                                        </TableCell>

                                                        {/* Zone */}
                                                        <TableCell className="text-sm text-gray-600">
                                                            {entry.zoneName || '-'}
                                                        </TableCell>

                                                        {/* Severity */}
                                                        <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(entry.severity)}`}>
                                {entry.severity || 'N/A'}
                              </span>
                                                        </TableCell>

                                                        {/* Entry Time */}
                                                        <TableCell className="text-sm">
                                                            {formatTime(entry.entryUtc)}
                                                        </TableCell>

                                                        {/* Exit Time */}
                                                        <TableCell className="text-sm">
                                                            {isStillInside(entry.exitUtc) ? (
                                                                <span className="text-emerald-600 font-medium flex items-center gap-1">
                                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                  Currently inside
                                </span>
                                                            ) : (
                                                                formatTime(entry.exitUtc)
                                                            )}
                                                        </TableCell>

                                                        {/* Dwell Time */}
                                                        <TableCell className="text-sm font-mono font-medium">
                                                            {isStillInside(entry.exitUtc) ? '--' : formatDwellTime(entry.dwellMinutes)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination Controls */}
                                {totalEntries > 0 && (
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                                        {/* Results Info */}
                                        <div className="text-sm text-gray-600">
                                            Showing <span className="font-medium">{startEntry}</span> to{' '}
                                            <span className="font-medium">{endEntry}</span> of{' '}
                                            <span className="font-medium">{totalEntries.toLocaleString()}</span> entries
                                        </div>

                                        {/* Pagination Controls */}
                                        <div className="flex items-center gap-2">
                                            {/* Page Size Selector */}
                                            <select
                                                value={pageSize}
                                                onChange={(e) => {
                                                    setPageSize(Number(e.target.value));
                                                    setPage(1);
                                                }}
                                                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            >
                                                <option value={10}>10 per page</option>
                                                <option value={25}>25 per page</option>
                                                <option value={50}>50 per page</option>
                                                <option value={100}>100 per page</option>
                                            </select>

                                            {/* First Page */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPage(1)}
                                                disabled={currentPage === 1 || isFetching}
                                            >
                                                <ChevronsLeft className="h-4 w-4" />
                                            </Button>

                                            {/* Previous Page */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1 || isFetching}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                Previous
                                            </Button>

                                            {/* Page Numbers */}
                                            <div className="flex gap-1">
                                                {(() => {
                                                    const maxVisible = 5;
                                                    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                                                    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

                                                    if (endPage - startPage < maxVisible - 1) {
                                                        startPage = Math.max(1, endPage - maxVisible + 1);
                                                    }

                                                    const pages = [];
                                                    for (let i = startPage; i <= endPage; i++) {
                                                        pages.push(i);
                                                    }

                                                    return pages.map((pageNum) => (
                                                        <Button
                                                            key={pageNum}
                                                            variant={currentPage === pageNum ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={() => setPage(pageNum)}
                                                            disabled={isFetching}
                                                            className={currentPage === pageNum ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                                                        >
                                                            {pageNum}
                                                        </Button>
                                                    ));
                                                })()}
                                            </div>

                                            {/* Next Page */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage >= totalPages || isFetching}
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>

                                            {/* Last Page */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPage(totalPages)}
                                                disabled={currentPage >= totalPages || isFetching}
                                            >
                                                <ChevronsRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}