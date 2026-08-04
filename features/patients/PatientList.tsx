"use client";

import React, { useState } from "react";
import { Plus, Search, User, Download, Calendar } from "lucide-react";
import { usePatients } from "@/hooks/usePatients";
import { useBusiness } from "@/hooks/useBusiness";
import { Button, Input, Select, Table, Badge, Pagination } from "@/components/ui";
import { PatientModal } from "@/components/admin/PatientModal";
import { PatientDetailDrawer } from "@/components/admin/PatientDetailDrawer";
import { AppointmentModal } from "@/components/admin/AppointmentModal";
import { ConfirmationModal } from "@/components/admin/ConfirmationModal";
import { exportPatientsCSV } from "@/utils/export";
import { Patient, Appointment } from "@/types";

export function PatientList() {
  const { patients = [], setPatients, deletePatient } = usePatients();
  const { terms } = useBusiness();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    id: string;
    name: string;
  }>({
    isOpen: false,
    id: "",
    name: "",
  });

  const filteredPatients = (patients || []).filter((p) => {
    if (!p || typeof p !== "object" || !p.id) return false;
    const matchesSearch =
      (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.mrn || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.phone || "").includes(searchQuery) ||
      (p.email || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRegisterPatient = (newPatient: Patient) => {
    if (!newPatient) return;
    setPatients([newPatient, ...(patients || [])]);
  };

  const columns = [
    {
      header: terms.clientLabel,
      cell: (row: Patient) => (
        <div className="flex items-center gap-3">
          <img
            src={row?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={row?.name || "Patient"}
            className="w-9 h-9 rounded-full object-cover border border-slate-700"
          />
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>{row?.name || "Guest Patient"}</span>
              <span className="text-[10px] font-mono text-teal-400 font-bold bg-slate-800 px-1.5 py-0.5 rounded">
                {row?.mrn || "MRN-000"}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              {row?.age || 30} yrs • {row?.gender || "N/A"} • Info: {row?.bloodGroup || "O+"}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Info",
      cell: (row: Patient) => (
        <div>
          <div className="font-semibold text-slate-200">{row?.phone || "N/A"}</div>
          <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{row?.email || "N/A"}</div>
        </div>
      ),
    },
    {
      header: "Primary Concern",
      cell: (row: Patient) => (
        <span className="text-xs font-semibold text-slate-300">
          {row?.disease || row?.conditions?.[0] || "General Audit"}
        </span>
      ),
    },
    {
      header: "Total Visits",
      cell: (row: Patient) => (
        <span className="font-mono font-bold text-teal-400">{row?.totalVisits || 1} Visits</span>
      ),
    },
    {
      header: "Status",
      cell: (row: Patient) => (
        <Badge variant={row?.status === "Active" ? "emerald" : "amber"}>
          ● {row?.status || "Active"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: (row: Patient) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (row) {
                setSelectedPatient(row);
                setIsDrawerOpen(true);
              }
            }}
          >
            Profile
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setConfirmDialog({
                isOpen: true,
                id: row?.id || "",
                name: row?.name || "Patient",
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
          <h1 className="text-xl font-bold text-white tracking-tight">{terms.clientsLabel} Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage patient electronic health records, history, and notes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportPatientsCSV(filteredPatients)}
            className="flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRegisterOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Register {terms.clientLabel}
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder={`Search by name, MRN, phone, email...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 bg-slate-950/60 border-slate-800 focus:border-teal-500"
          />
        </div>

        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          options={[
            { value: "All", label: "All Statuses" },
            { value: "Active", label: "Active" },
            { value: "Follow-up Required", label: "Follow-up Required" },
            { value: "Archived", label: "Archived" },
          ]}
          className="w-44 bg-slate-950/60 border-slate-800 text-xs"
        />
      </div>

      {/* Data Table */}
      <Table
        columns={columns}
        data={paginatedPatients}
        keyExtractor={(item) => (item && item.id ? item.id : `pat-${Math.random()}`)}
        emptyText={`No ${terms.clientsLabel.toLowerCase()} found.`}
      />

      {/* Pagination */}
      {filteredPatients.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Register Patient Modal */}
      <PatientModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSave={handleRegisterPatient}
      />

      {/* Patient Detail Drawer */}
      <PatientDetailDrawer
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
        onOpenSchedule={() => {
          setIsDrawerOpen(false);
          setIsScheduleOpen(true);
        }}
      />

      {/* Schedule Modal */}
      <AppointmentModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSave={() => {}}
      />

      {/* Confirmation Dialog */}
      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (confirmDialog.id) deletePatient(confirmDialog.id);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }}
        title={`Delete ${terms.clientLabel} Record`}
        message={`Are you sure you want to permanently delete record for ${confirmDialog.name}?`}
        confirmText="Yes, Delete Record"
        type="delete"
      />
    </div>
  );
}
