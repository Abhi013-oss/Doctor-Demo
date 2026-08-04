"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, Calendar, Download } from "lucide-react";
import { useAppointments } from "@/hooks/useAppointments";
import { useBusiness } from "@/hooks/useBusiness";
import { Button, Input, Select, Table, Badge, Pagination } from "@/components/ui";
import { AppointmentModal } from "@/components/admin/AppointmentModal";
import { AppointmentDetailsModal } from "@/components/admin/AppointmentDetailsModal";
import { ConfirmationModal } from "@/components/admin/ConfirmationModal";
import { exportAppointmentsCSV, printTable } from "@/utils/export";
import { Appointment } from "@/types";

export function AppointmentList() {
  const {
    appointments = [],
    approveAppointment,
    rejectAppointment,
    deleteAppointment,
    rescheduleAppointment,
    setAppointments,
  } = useAppointments();
  const { terms } = useBusiness();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal States
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | "delete";
    id: string;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "approve",
    id: "",
    title: "",
    message: "",
  });

  // Safe Filter Logic
  const filteredAppointments = (appointments || []).filter((apt) => {
    if (!apt || typeof apt !== "object" || !apt.id) return false;
    const matchesSearch =
      (apt.patientName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (apt.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (apt.department || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (apt.patientPhone || "").includes(searchQuery);

    const matchesStatus = statusFilter === "All" || apt.status === statusFilter;
    const matchesType = typeFilter === "All" || apt.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage) || 1;
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSaveAppointment = (newApt: Partial<Appointment>) => {
    if (!newApt) return;
    const created = newApt as Appointment;
    setAppointments([created, ...(appointments || [])]);
  };

  const getBadgeVariant = (status?: string) => {
    switch (status) {
      case "Approved":
      case "Completed":
        return "emerald";
      case "Pending":
      case "Waiting":
      case "In Progress":
        return "amber";
      case "Rejected":
      case "Cancelled":
        return "rose";
      default:
        return "slate";
    }
  };

  const columns = [
    {
      header: `${terms.bookingLabel} ID`,
      accessorKey: "id" as keyof Appointment,
      cell: (row: Appointment) => <span className="font-mono font-bold text-teal-400">{row?.id || "N/A"}</span>,
    },
    {
      header: terms.clientLabel,
      cell: (row: Appointment) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={row?.patientName || "Patient"}
            className="w-8 h-8 rounded-full object-cover border border-slate-700"
          />
          <div>
            <div className="font-bold text-white">{row?.patientName || "Guest Patient"}</div>
            <div className="text-[10px] text-slate-400">{row?.patientPhone || "N/A"}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Date & Time",
      cell: (row: Appointment) => (
        <div>
          <div className="font-semibold text-slate-200">{row?.date || "Today"}</div>
          <div className="text-[10px] text-slate-400">{row?.time || "Pending"}</div>
        </div>
      ),
    },
    {
      header: "Department",
      accessorKey: "department" as keyof Appointment,
    },
    {
      header: "Type",
      cell: (row: Appointment) => (
        <span className="text-xs font-semibold text-sky-400">{row?.type || "In-Person"}</span>
      ),
    },
    {
      header: "Status",
      cell: (row: Appointment) => (
        <Badge variant={getBadgeVariant(row?.status)}>● {row?.status || "Pending"}</Badge>
      ),
    },
    {
      header: "Actions",
      cell: (row: Appointment) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (row) {
                setSelectedAppointment(row);
                setIsDetailsOpen(true);
              }
            }}
          >
            View
          </Button>

          {row?.status === "Pending" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                setConfirmDialog({
                  isOpen: true,
                  type: "approve",
                  id: row?.id || "",
                  title: `Approve ${terms.bookingLabel}`,
                  message: `Are you sure you want to approve ${row?.patientName || "this"}'s ${terms.bookingLabel}?`,
                })
              }
            >
              Approve
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setConfirmDialog({
                isOpen: true,
                type: "delete",
                id: row?.id || "",
                title: `Delete ${terms.bookingLabel}`,
                message: `Are you sure you want to permanently delete record ${row?.id || ""}?`,
              })
            }
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">{terms.bookingsLabel} Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage, approve, schedule, and review client {terms.bookingsLabel.toLowerCase()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportAppointmentsCSV(filteredAppointments)}
            className="flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsScheduleOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            New {terms.bookingLabel}
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder={`Search by name, ID, phone...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 bg-slate-950/60 border-slate-800 focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: "All", label: "All Statuses" },
              { value: "Pending", label: "Pending" },
              { value: "Approved", label: "Approved" },
              { value: "In Progress", label: "In Progress" },
              { value: "Completed", label: "Completed" },
              { value: "Cancelled", label: "Cancelled" },
            ]}
            className="w-40 bg-slate-950/60 border-slate-800 text-xs"
          />

          <Select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: "All", label: "All Visit Types" },
              { value: "In-Person", label: "In-Person" },
              { value: "Telehealth", label: "Telehealth" },
              { value: "Follow-up", label: "Follow-up" },
            ]}
            className="w-40 bg-slate-950/60 border-slate-800 text-xs"
          />
        </div>
      </div>

      {/* Data Table */}
      <Table
        columns={columns}
        data={paginatedAppointments}
        keyExtractor={(item) => (item && item.id ? item.id : `apt-${Math.random()}`)}
        emptyText={`No ${terms.bookingsLabel.toLowerCase()} found.`}
      />

      {/* Pagination */}
      {filteredAppointments.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Schedule Modal */}
      <AppointmentModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSave={handleSaveAppointment}
      />

      {/* Details Modal */}
      <AppointmentDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
        onApprove={(id) => {
          approveAppointment(id);
          setIsDetailsOpen(false);
        }}
        onReject={(id) => {
          rejectAppointment(id);
          setIsDetailsOpen(false);
        }}
        onReschedule={(id, date, time) => {
          rescheduleAppointment(id, date, time);
          setIsDetailsOpen(false);
        }}
      />

      {/* Confirmation Dialog */}
      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (confirmDialog.type === "approve") approveAppointment(confirmDialog.id);
          if (confirmDialog.type === "reject") rejectAppointment(confirmDialog.id);
          if (confirmDialog.type === "delete") deleteAppointment(confirmDialog.id);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.type === "delete" ? "Yes, Delete Record" : "Confirm Action"}
        type={confirmDialog.type}
      />
    </div>
  );
}
