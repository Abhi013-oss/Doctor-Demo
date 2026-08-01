import { Appointment, Patient, MessageThread } from "../types";

export function exportAppointmentsCSV(appointments: Appointment[]): void {
  if (typeof window === "undefined") return;

  const headers = [
    "Appointment ID",
    "Patient Name",
    "Phone",
    "Email",
    "Age",
    "Gender",
    "Department",
    "Doctor",
    "Date",
    "Time",
    "Type",
    "Status",
    "Reason",
  ];

  const rows = appointments.map((apt) => [
    apt.id,
    `"${apt.patientName.replace(/"/g, '""')}"`,
    `"${apt.patientPhone}"`,
    `"${apt.patientEmail}"`,
    apt.patientAge,
    apt.patientGender,
    `"${apt.department}"`,
    `"${apt.doctorName}"`,
    apt.date,
    apt.time,
    apt.type,
    apt.status,
    `"${(apt.reason || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadBlob(csvContent, `appointments-export-${new Date().toISOString().split("T")[0]}.csv`, "text/csv;charset=utf-8;");
}

export function exportPatientsCSV(patients: Patient[]): void {
  if (typeof window === "undefined") return;

  const headers = [
    "Patient ID",
    "MRN",
    "Name",
    "Age",
    "Gender",
    "Blood Group",
    "Phone",
    "Email",
    "Status",
    "Total Visits",
    "Last Visit",
  ];

  const rows = patients.map((p) => [
    p.id,
    p.mrn,
    `"${p.name.replace(/"/g, '""')}"`,
    p.age,
    p.gender,
    p.bloodGroup,
    `"${p.phone}"`,
    `"${p.email}"`,
    p.status,
    p.totalVisits,
    p.lastVisit,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadBlob(csvContent, `patients-export-${new Date().toISOString().split("T")[0]}.csv`, "text/csv;charset=utf-8;");
}

export function exportMessagesCSV(threads: MessageThread[]): void {
  if (typeof window === "undefined") return;

  const headers = ["Thread ID", "Patient Name", "Category", "Is Urgent", "Last Message", "Timestamp"];

  const rows = threads.map((t) => [
    t.id,
    `"${t.patientName.replace(/"/g, '""')}"`,
    `"${t.category}"`,
    t.isUrgent ? "YES" : "NO",
    `"${(t.lastMessage || "").replace(/"/g, '""')}"`,
    t.timestamp,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadBlob(csvContent, `messages-export-${new Date().toISOString().split("T")[0]}.csv`, "text/csv;charset=utf-8;");
}

export function printTable(title: string, htmlContent: string): void {
  if (typeof window === "undefined") return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 20px; color: #0f172a; }
          h1 { font-size: 20px; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 12px; }
          th { background-color: #f1f5f9; font-weight: bold; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${htmlContent}
        <script>
          window.onload = () => {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
