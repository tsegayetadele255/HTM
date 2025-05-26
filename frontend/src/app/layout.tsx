import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vascular Equipment II cmms",
  description: "Computerised Maintenance Management System for Vascular Equipment II.",
};

import Link from "next/link";

function Sidebar() {
  const tabs = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Equipment", path: "/equipment" },
    { label: "Work Orders", path: "/workorders" },
    { label: "Spare Parts", path: "/spareparts" },
    { label: "Users", path: "/users" },
    { label: "Incident Reporting", path: "/incidents" },
    { label: "SOPs", path: "/sops" },
    { label: "Training", path: "/training" },
    { label: "Calibration", path: "/calibration" },
    { label: "Audit Logs", path: "/auditlogs" },
    { label: "Disposal & Decommissioning", path: "/disposals" },
    { label: "Budget & Procurement", path: "/procurement" },
  ];
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  // For SSR/Next.js, usePathname is preferred, but fallback to window.location.pathname if unavailable
  // If in a client component, usePathname() can be called directly

  return (
    <aside style={{
      width: 260,
      minWidth: 260,
      maxWidth: 260,
      background: '#21243d',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1rem',
      minHeight: '100vh',
      maxHeight: '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      position: 'relative',
      boxSizing: 'border-box',
    }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '2rem', letterSpacing: 1 }}>CMMS</h1>
      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {tabs.map(tab => {
            const isActive = pathname.startsWith(tab.path);
            return (
              <li key={tab.path} style={{ marginBottom: 16, borderRadius: 6, transition: 'background 0.2s', cursor: 'pointer', padding: 0, fontWeight: 500, fontSize: '1.07rem', background: 'none' }}>
                <Link
                  href={tab.path}
                  style={{
                    display: 'block',
                    padding: '10px 18px',
                    borderRadius: 6,
                    background: isActive ? '#363a55' : 'none',
                    color: isActive ? '#fff' : '#c7c9d9',
                    textDecoration: 'none',
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <footer style={{ marginTop: 'auto', fontSize: 13, opacity: 0.7 }}>© {new Date().getFullYear()} CMMS</footer>
    </aside>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f6fa', width: '100vw', overflow: 'hidden' }}>
          <Sidebar />
          <div style={{ flex: 1, minWidth: 0, maxWidth: '100vw', height: '100vh', overflow: 'auto', padding: '2rem' }}>
            <main style={{ minWidth: 0 }}>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
