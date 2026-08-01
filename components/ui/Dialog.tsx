import React from "react";
import { AlertTriangle, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  type?: "approve" | "reject" | "complete" | "cancel" | "delete";
}

export function Dialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  type = "approve",
}: DialogProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-2xl ${
              type === "approve" || type === "complete"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : type === "delete" || type === "reject"
                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            {type === "approve" && <CheckCircle2 className="w-6 h-6" />}
            {type === "complete" && <CheckCircle2 className="w-6 h-6" />}
            {type === "reject" && <XCircle className="w-6 h-6" />}
            {type === "delete" && <Trash2 className="w-6 h-6" />}
            {type === "cancel" && <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-bold text-base text-white">{title}</h3>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5">
              Action Confirmation Required
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{message}</p>

        <div className="pt-2 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={type === "delete" || type === "reject" ? "danger" : "primary"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export { Dialog as ConfirmationModal };
