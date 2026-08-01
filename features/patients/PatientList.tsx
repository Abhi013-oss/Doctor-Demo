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
  const { patients, setPatients, deletePatient } = usePatients();
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

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRegisterPatient = (newPatient: Patient) => {
    setPatients([newPatient, ...patients]);
  };

  const columns = [
    {
      header: terms.clientLabel,
      cell: (row: Patient) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={row.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-700"
          />
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>{row.name}</span>
              <span className="text-[10px] font-mono text-teal-400 font-bold bg-slate-800 px-1.5 py-0.5 rounded">
                {row.mrn}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              {row.age} yrs • {row.gender} • Info: {row.bloodGroup}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Info",
      cell: (row: Patient) => (
        <div>
          <div className="font-semibold text-slate-200">{row.phone}</div>
          <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{row.email}</div>
        </div>
      ),
    },
    {
      header: "Primary Concern",
      cell: (row: Patient) => (
        <span className="text-xs font-semibold text-slate-300">
          {row.disease || row.conditions?.[0] || "General Audit"}
        </span>
      ),
    },
    {
      header: "Visits",
      cell: (row: Patient) => (
        <div>
          <div className="font-bold text-white">{row.totalVisits} visits</div>
          <div className="text-[10px] text-slate-400">Last: {row.lastVisit}</div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row: Patient) => (
        <Badge variant={row.status === "Active" ? "emerald" : "amber"}>
          ● {row.status}
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
              setSelectedPatient(row);
              setIsDrawerOpen(true);
            }}
          >
            View EHR File
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setConfirmDialog({
                isOpen: true,
                id: row.id,
                name: row.name,
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">{terms.clientsLabel} Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Electronic Records (EHR) & client profiles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportPatientsCSV(filteredPatients)}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRegisterOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Register {terms.clientLabel}
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <Input
          placeholder={`Search by name, MRN, phone, email...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4 text-slate-400" />}
        />

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { label: "All Patient Statuses", value: "All" },
            { label: "Active", value: "Active" },
            { label: "Follow-up Required", value: "Follow-up Required" },
            { label: "New", value: "New" },
            { label: "Discharged", value: "Discharged" },
          ]}
        />
      </div>

      {/* Data Table */}
      <Table
        data={paginatedPatients}
        columns={columns}
        keyExtractor={(row) => row.id}
        emptyText={`No ${terms.clientsLabel.toLowerCase()} found matching your filters.`}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalResults={filteredPatients.length}
        showingCount={paginatedPatients.length}
      />

      {/* Register Patient Modal */}
      <PatientModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSave={handleRegisterPatient}
      />

      {/* Detail Drawer */}
      <PatientDetailDrawer
        patient={selectedPatient}
        onClose={() => setIsDrawerOpen(false)}
        onOpenSchedule={(p) => {
          setSelectedPatient(p);
          setIsScheduleOpen(true);
        }}
      />

      {/* Appointment Schedule Modal */}
      <AppointmentModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSave={(apt) => {
          // Saved via store
        }}
      />

      {/* Confirmation Dialog */}
      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        title={`Delete ${terms.clientLabel} Record`}
        message={`Are you sure you want to delete ${confirmDialog.name}'s profile? All associated appointments will also be removed.`}
        confirmText="Delete Record"
        type="delete"
        onConfirm={() => deletePatient(confirmDialog.id)}
      />
    </div>
  );
}
