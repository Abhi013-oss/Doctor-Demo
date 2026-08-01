"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Paperclip, Sparkles, FileText, Inbox } from "lucide-react";
import { ChatMessage } from "@/types";
import { useLiveClinicData } from "@/lib/store";
import { useBusiness } from "@/hooks/useBusiness";
import { Button, Input } from "@/components/ui";
import Link from "next/link";

export function ChatConsole() {
  const { messages, setMessages, patients } = useLiveClinicData();
  const { terms } = useBusiness();
  const [activeThreadId, setActiveThreadId] = useState<string | null>(messages[0]?.id || null);
  const [inputText, setInputText] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const activeThread = messages.find((t) => t.id === activeThreadId) || messages[0];
  const matchedPatient = patients.find((p) => p.id === activeThread?.patientId || p.name === activeThread?.patientName);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "doctor",
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages(
      messages.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              messages: [...t.messages, newMsg],
              lastMessage: newMsg.text,
              timestamp: "Just now",
              unreadCount: 0,
            }
          : t
      )
    );
    setInputText("");
  };

  const handleQuickReply = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col md:flex-row rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in duration-300">
      {/* Left Column: Inbox Threads */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-800 flex flex-col bg-slate-950/40 shrink-0">
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-400" />
              {terms.clientLabel} Inbox ({messages.length})
            </h2>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            {["All", "Urgent", "Appointments", "Inquiries"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-xl font-bold transition-colors shrink-0 ${
                  filterCategory === cat
                    ? "bg-teal-500 text-slate-950"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs">No {terms.clientLabel.toLowerCase()} messages yet.</p>
            </div>
          ) : (
            messages.map((thread) => {
              const isActive = thread.id === (activeThreadId || messages[0]?.id);

              return (
                <button
                  key={thread.id}
                  onClick={() => {
                    setActiveThreadId(thread.id);
                    setMessages(
                      messages.map((t) => (t.id === thread.id ? { ...t, unreadCount: 0 } : t))
                    );
                  }}
                  className={`w-full p-4 text-left transition-all flex items-start gap-3 relative ${
                    isActive ? "bg-slate-800/80 border-l-4 border-teal-400" : "hover:bg-slate-800/40"
                  }`}
                >
                  <img
                    src={thread.patientAvatar}
                    alt={thread.patientName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white truncate">{thread.patientName}</span>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">{thread.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-400 truncate mt-1">{thread.lastMessage}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Center Column: Chat Window */}
      {activeThread ? (
        <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeThread.patientAvatar}
                alt={activeThread.patientName}
                className="w-10 h-10 rounded-full object-cover border border-teal-500/40"
              />
              <div>
                <h3 className="font-bold text-sm text-white">{activeThread.patientName}</h3>
                <p className="text-[11px] text-slate-400">
                  Category: <strong className="text-teal-400">{activeThread.category}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeThread.messages.map((msg) => {
              const isDoctor = msg.sender === "doctor";

              return (
                <div key={msg.id} className={`flex ${isDoctor ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-md p-4 rounded-2xl space-y-1 ${
                      isDoctor
                        ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-slate-950 rounded-br-none shadow-lg"
                        : "bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-bl-none"
                    }`}
                  >
                    <p className="text-xs leading-relaxed font-medium">{msg.text}</p>
                    <span className={`block text-[10px] font-mono text-right ${isDoctor ? "text-slate-900/80" : "text-slate-400"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Replies */}
          <div className="p-3 bg-slate-950/40 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold uppercase text-slate-500 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Quick Replies:
            </span>
            <button
              onClick={() => handleQuickReply("Your request has been processed successfully.")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs shrink-0"
            >
              Confirmed & Processed
            </button>
            <button
              onClick={() => handleQuickReply("Your consultation is confirmed. Click link to join session.")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs shrink-0"
            >
              Session Link
            </button>
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
            <button
              type="button"
              className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Attach Document"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Reply to ${activeThread.patientName}...`}
              className="flex-1"
            />

            <Button variant="primary" type="submit" leftIcon={<Send className="w-4 h-4" />}>
              Send
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500 space-y-3">
          <Inbox className="w-12 h-12 text-slate-600" />
          <h3 className="text-base font-bold text-slate-300">No Active Conversation Selected</h3>
        </div>
      )}
    </div>
  );
}
