"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { CLINIC_INFO } from "@/lib/data";

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappUrl = `https://wa.me/${CLINIC_INFO.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hello AuraHealth Clinic, I would like to inquire about booking an appointment with Dr. Evelyn Reed."
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Floating Popup Card */}
      {isOpen && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                AH
              </div>
              <div>
                <h4 className="font-semibold text-sm">AuraHealth Live Care</h4>
                <span className="flex items-center gap-1.5 text-xs text-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                  Replies in ~5 minutes
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              aria-label="Close message popup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 bg-slate-50 text-slate-700 text-xs space-y-3">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200/60 text-slate-800 leading-relaxed">
              👋 Hi there! Have a question about Dr. Evelyn Reed or want to book an instant slot? Chat with our clinic coordinator on WhatsApp.
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition transform active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Start WhatsApp Chat</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 focus:outline-none pulse-glow"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-white"></span>
        
        {/* Hover Tooltip */}
        <span className="absolute right-16 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Need quick help? Chat on WhatsApp
        </span>
      </button>
    </div>
  );
}
