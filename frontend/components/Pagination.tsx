"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    isMobile: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   currentPage,
                                                   setCurrentPage,
                                                   totalPages,
                                                   totalItems,
                                                   itemsPerPage,
                                                   isMobile
                                               }) => {
    const getVisiblePageNumbers = () => {
        if (!totalPages) return;

        const delta = isMobile? 1: 2;
        const range = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            range.unshift("...");
        }
        if (currentPage + delta < totalPages - 1) {
            range.push("...");
        }

        if (totalPages > 1) {
            range.unshift(1);
            if (range[range.length - 1]!== totalPages) {
                range.push(totalPages);
            }
        }

        return range;
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center items-center gap-2">
                <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    size="sm"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {getVisiblePageNumbers().map((pageNumber, index) =>
                    pageNumber === "..."? (
                        <span key={`ellipsis-${index}`} className="px-2">
                           ...
                         </span>
                    ): (
                        <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber? "default": "outline"}
                            onClick={() => setCurrentPage(Number(pageNumber))}
                            size="sm"
                            className="min-w-[32px]"
                        >
                            {pageNumber}
                        </Button>
                    )
                )}

                <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    size="sm"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="text-sm text-muted-foreground text-center">
                Affichage de {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} -{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} sur {totalItems} résultats
            </div>
        </div>
    );
};

export default Pagination;