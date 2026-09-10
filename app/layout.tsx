import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "National Pharmacist Registry — Liberia Pharmacy Board",
    template: "%s · LPB National Pharmacist Registry",
  },
  description:
    "Official digital registry for the Liberia Pharmacy Board 2026 Pharmacist Census. Pharmacists across all 15 counties submit credentials online; the LPB uses the data for workforce planning and regulation.",
  keywords: ["Liberia Pharmacy Board", "LPB", "pharmacist registry", "census 2026", "Liberia"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-800">{children}</body>
    </html>
  );
}
