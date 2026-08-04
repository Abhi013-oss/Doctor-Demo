import React from "react";
import { cn } from "../../utils/cn";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  emptyText?: string;
  isLoading?: boolean;
  className?: string;
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  emptyText = "No records found.",
  isLoading = false,
  className,
}: TableProps<T>) {
  const safeData = (data || []).filter(Boolean);

  return (
    <div className={cn("w-full overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl", className)}>
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={cn("px-4 py-3.5", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                  <span>Loading records...</span>
                </div>
              </td>
            </tr>
          ) : safeData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            safeData.map((row, index) => {
              if (!row) return null;
              let rowKey = `row-${index}`;
              try {
                rowKey = keyExtractor(row) || `row-${index}`;
              } catch {
                rowKey = `row-${index}`;
              }

              return (
                <tr key={rowKey} className="hover:bg-slate-800/40 transition-colors">
                  {columns.map((col, idx) => (
                    <td key={idx} className={cn("px-4 py-3.5 font-medium whitespace-nowrap", col.className)}>
                      {col.cell
                        ? col.cell(row)
                        : col.accessorKey && row[col.accessorKey] !== undefined
                        ? String(row[col.accessorKey] ?? "")
                        : null}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
