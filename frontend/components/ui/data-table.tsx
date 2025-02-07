"use client";

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps<T> {
    columns: {
        key: string;
        title: string;
        render?: (item: T) => React.ReactNode;
    }[];
    data: T[];
    onRowClick?: (item: T) => void;
    className?: string;
    noDataText?: string;
    pagination?: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    } | null;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
}

export function DataTable<T>({
                                 columns,
                                 data,
                                 onRowClick,
                                 className = "",
                                 noDataText = "Aucune donnée",
                                 pagination = null,
                                 onPageChange,
                                 onPageSizeChange
                             }: DataTableProps<T>) {
    const pageSizes = [5, 10, 25, 50];

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="rounded-lg border border-blue-900/20">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.key} className="text-blue-100/80 bg-blue-950/50">
                                    {column.title}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center text-blue-100/60 h-32"
                                >
                                    {noDataText}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, index) => (
                                <TableRow
                                    key={index}
                                    onClick={() => onRowClick?.(item)}
                                    className={`bg-blue-950/30 hover:bg-blue-950/50 ${onRowClick ? 'cursor-pointer' : ''}`}
                                >
                                    {columns.map((column) => (
                                        <TableCell key={column.key} className="text-blue-100/80">
                                            {column.render ? column.render(item) : (item as any)[column.key]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && (
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-blue-100/60">Éléments par page:</span>
                        <Select
                            value={String(pagination.pageSize)}
                            onValueChange={(value) => onPageSizeChange?.(Number(value))}
                        >
                            <SelectTrigger className="w-24 bg-blue-950/50 border-blue-900/30">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-blue-950 border-blue-900/30">
                                {pageSizes.map(size => (
                                    <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-blue-100/60">
              {((pagination.currentPage - 1) * pagination.pageSize) + 1} - {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} sur {pagination.totalItems}
            </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange?.(pagination.currentPage - 1)}
                            disabled={pagination.currentPage <= 1}
                            className="border-blue-900/20"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-blue-100/60">
              Page {pagination.currentPage} sur {pagination.totalPages}
            </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange?.(pagination.currentPage + 1)}
                            disabled={pagination.currentPage >= pagination.totalPages}
                            className="border-blue-900/20"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}