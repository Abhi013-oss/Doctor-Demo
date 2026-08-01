export type StatusVariant = "emerald" | "amber" | "rose" | "teal" | "slate" | "sky" | "indigo" | "purple";

export type BaseStatus = "Active" | "Pending" | "Completed" | "Cancelled" | "Draft" | "Archived";

export interface OptionItem<T = string> {
  label: string;
  value: T;
  icon?: string;
  description?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FilterParams {
  searchQuery?: string;
  statusFilter?: string;
  categoryFilter?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
