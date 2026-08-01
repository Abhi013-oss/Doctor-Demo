import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/admin/AuthProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://doctorclinic.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "AuraHealth Doctor Clinic | Premier Cardiology & Medical Services",
    template: "%s | AuraHealth Doctor Clinic",
  },
  description:
    "Leading medical clinic offering specialized cardiology, preventive health checkups, emergency care, and patient-centered treatment from top medical specialists.",
  keywords: [
    "Doctor Clinic",
    "Cardiology",
    "Medical Services",
    "Healthcare",
    "Appointment Booking",
    "Physicians",
    "Doctor Management",
  ],
  authors: [{ name: "AuraHealth Care Team" }],
  creator: "AuraHealth Medical Group",
  publisher: "AuraHealth Healthcare",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "AuraHealth Doctor Clinic",
    title: "AuraHealth Doctor Clinic | Premier Medical Services",
    description:
      "Book doctor appointments online, access advanced medical care, and consult with leading medical specialists.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraHealth Doctor Clinic | Premier Medical Services",
    description:
      "Book doctor appointments online and access expert clinical care.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-teal-500 selection:text-slate-950">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
