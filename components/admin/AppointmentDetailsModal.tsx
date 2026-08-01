"use client";

import React, { useState } from "react";
import { Calendar, Clock, Phone, Mail, RefreshCw } from "lucide-react";
import { Appointment } from "@/types";
import { Modal, Button, Input, Badge } from "../ui";
import { useBusiness } from "@/hooks/useBusiness";

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string, newDate: string, newTime: string) => void;
}

export function AppointmentDetailsModal({
  appointment,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onReschedule,
}: AppointmentDetailsModalProps) {
  const { terms } = useBusiness();
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState(appointment?.date || "");
  const [newTime, setNewTime] = useState(appointment?.time || "");

  if (!isOpen || !appointment) return null;

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onReschedule && newDate && newTime) {
      onReschedule(appointment.id, newDate, newTime);
      setIsRescheduling(false);
      onClose();
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Approved":
      case "Completed":
        return "emerald";
      case "Pending":
      case "Waiting":
        return "amber";
      case "Rejected":
      case "Cancelled":
        return "rose";
      default:
        return "slate";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="space-y-6">
        {/* Header Profile */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <img
            src={appointment.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={appointment.patientName}
            className="w-12 h-12 rounded-full object-cover border border-slate-700"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">{appointment.patientName}</h3>
              <span className="font-mono text-xs text-teal-400 font-bold">{appointment.id}</span>
            </div>
            <p className="text-xs text-slate-400">
              {appointment.patientAge} yrs • {appointment.patientGender} • Registered {terms.clientLabel}
            </p>
          </div>
        </div>

        {/* Status & Type Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Current Status
            </span>
            <Badge variant={getBadgeVariant(appointment.status)}>
              ● {appointment.status}
            </Badge>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Visit Type
            </span>
            <span className="text-xs font-bold text-teal-400">{appointment.type}</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Contact Info
            </span>
            <p className="text-slate-200 flex items-center gap-1.5 font-semibold">
              <Phone className="w-3.5 h-3.5 text-teal-400" /> {appointment.patientPhone}
            </p>
            <p className="text-slate-300 flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 text-teal-400" /> {appointment.patientEmail}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              {terms.bookingLabel} Schedule
            </span>
            <p className="text-slate-200 flex items-center gap-1.5 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-teal-400" /> {appointment.date}
            </p>
            <p className="text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" /> {appointment.time}
            </p>
          </div>
        </div>

        {/* Category & Reason */}
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Department / Category
          </span>
          <p className="text-sm font-bold text-white">{appointment.department}</p>
          <p className="text-slate-300 leading-relaxed pt-1 border-t border-slate-800/80">
            <strong className="text-slate-400">Chief Reason:</strong> &quot;{appointment.reason}&quot;
          </p>
        </div>

        {/* Reschedule Form Box */}
        {isRescheduling && (
          <form onSubmit={handleRescheduleSubmit} className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 space-y-4">
            <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" /> Select New Schedule Slot
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="New Date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
              />
              <Input
                label="New Time"
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="e.g. 11:30 AM"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="secondary" size="sm" type="button" onClick={() => setIsRescheduling(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Confirm Reschedule
              </Button>
            </div>
          </form>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRescheduling(!isRescheduling)}
            leftIcon={<RefreshCw className="w-3.5 h-3.5 text-teal-400" />}
          >
            Reschedule Slot
          </Button>

          <div className="flex items-center gap-2">
            {onReject && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  onReject(appointment.id);
                  onClose();
                }}
              >
                Reject
              </Button>
            )}

            {onApprove && appointment.status !== "Approved" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onApprove(appointment.id);
                  onClose();
                }}
              >
                Approve {terms.bookingLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
