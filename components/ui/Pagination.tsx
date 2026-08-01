import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults?: number;
  showingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
  showingCount,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
      {totalResults !== undefined && (
        <p className="text-xs text-slate-400">
          Showing <span className="font-semibold text-white">{showingCount || 0}</span> of{" "}
          <span className="font-semibold text-white">{totalResults}</span> records
        </p>
      )}

      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        <span className="text-xs font-semibold text-slate-400 px-2">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          rightIcon={<ChevronRight className="w-4 h-4" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
