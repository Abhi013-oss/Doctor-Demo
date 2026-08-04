"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard caught error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Dashboard Session Notice
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The operations dashboard encountered a transient session update. Click refresh below to restore real-time telemetry.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Reload Dashboard View
        </button>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all"
        >
          <LayoutDashboard className="w-4 h-4 text-teal-400" />
          Console Home
        </Link>
      </div>
    </div>
  );
}
