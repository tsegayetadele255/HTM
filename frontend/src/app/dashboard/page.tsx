"use client";
import React, { useEffect, useState } from "react";
// Extend Equipment type locally for dashboard logic
import type { Equipment as EquipmentBase } from "../equipment/EquipmentTable";
type Equipment = EquipmentBase & { nextCalibrationDate?: string };

import Image from "next/image";
import axios from "axios";

const CARD_CONFIG = [
  { label: "Total Equipments", icon: "🩺", color: "#2d5be3" },
  { label: "Active Work Orders", icon: "📝", color: "#f59e42" },
  { label: "Pending Procurements", icon: "📦", color: "#6d41e3" },
  { label: "Incidents Reported", icon: "⚠️", color: "#e32d2d" },
  { label: "Scheduled Calibrations", icon: "🔧", color: "#2dbd85" },
];


const PIE_COLORS = {
  Active: "#2d5be3",
  Inactive: "#a8a8a8",
  "Under Maintenance": "#f59e42",
  Decommissioned: "#e32d2d",
};

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function EquipmentStatusPieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const chartJsData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        data: data.map(d => d.value),
        backgroundColor: data.map(d => d.color),
        borderWidth: 1,
      },
    ],
  };
  return <Pie data={chartJsData} options={{ plugins: { legend: { position: 'right' } } }} />;
}

export default function DashboardPage() {
  const [summaryData, setSummaryData] = useState([
    { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }
  ]);
  const [chartData, setChartData] = useState([
    { label: "Operational", value: 0, color: PIE_COLORS.Active },
    { label: "Under Maintenance", value: 0, color: PIE_COLORS["Under Maintenance"] },
    { label: "Decommissioned", value: 0, color: PIE_COLORS.Decommissioned },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [equipRes, workOrderRes, procurementRes, incidentRes] = await Promise.all([
          axios.get("/api/equipment"),
          axios.get("/api/workorders"),
          axios.get("/api/procurement"),
          axios.get("/api/incidents"),
        ]);
        const equipment: Equipment[] = equipRes.data || [];
        const workOrders: { status?: string }[] = workOrderRes.data || [];
        const procurements: { status?: string }[] = procurementRes.data || [];
        const incidents: unknown[] = incidentRes.data || [];
        console.log('Fetched equipment:', equipment);
        const scheduledCalibrations = equipment.filter(e => e.nextCalibrationDate && new Date(e.nextCalibrationDate) > new Date()).length;
        const statusMap: Record<string, "Active" | "Inactive" | "Under Maintenance" | "Decommissioned"> = {
          "active": "Active",
          "Active": "Active",
          "ACTIVE": "Active",
          "inactive": "Inactive",
          "Inactive": "Inactive",
          "INACTIVE": "Inactive",
          "under maintenance": "Under Maintenance",
          "maintenance": "Under Maintenance",
          "UNDER MAINTENANCE": "Under Maintenance",
          "decommissioned": "Decommissioned",
          "Decommissioned": "Decommissioned",
          "DECOMMISSIONED": "Decommissioned",
          // Add more mappings as needed
        };
        const statusCounts: Record<string, number> = { Active: 0, Inactive: 0, "Under Maintenance": 0, Decommissioned: 0 };
        equipment.forEach(e => {
          const rawStatus = (e.status || "").toString().trim();
          const mappedStatus = statusMap[rawStatus];
          if (mappedStatus) {
            statusCounts[mappedStatus]++;
          }
          // Optionally handle unknowns:
          // else { statusCounts["Active"]++; }
        });
        setSummaryData([
          { value: equipment.length },
          { value: workOrders.filter(w => w.status === 'Active' || w.status === 'Open').length },
          { value: procurements.filter(p => p.status === 'Pending').length },
          { value: incidents.length },
          { value: scheduledCalibrations },
        ]);
        setChartData([
          { label: "Active", value: statusCounts.Active, color: PIE_COLORS.Active },
          { label: "Inactive", value: statusCounts.Inactive, color: PIE_COLORS.Inactive },
          { label: "Under Maintenance", value: statusCounts["Under Maintenance"], color: PIE_COLORS["Under Maintenance"] },
          { label: "Decommissioned", value: statusCounts.Decommissioned, color: PIE_COLORS.Decommissioned },
        ]);

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ padding: "2.5rem 0", width: "100%", background: "#f7f8fa", minHeight: "100vh" }}>
      {/* Branding and Welcome */}
      <div style={{ display: "flex", alignItems: "center", gap: 36, marginBottom: 38 }}>
        <Image src="/vascular-cmms-logo.png" alt="Vascular CMMS Logo" width={64} height={64} style={{ borderRadius: 18, background: '#fff', boxShadow: '0 2px 8px #0001' }} />
        <div>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, letterSpacing: 0.5, color: "#2d5be3" }}>Vascular Equipment CMMS</h1>
          <div style={{ fontSize: 18, color: "#3a3c4f", marginTop: 8, fontWeight: 500 }}>
            Computerised Maintenance Management System for Vascular Equipment II!
          </div>
        </div>
      </div>
      {/* Summary Cards */}
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 38 }}>
        {CARD_CONFIG.map((card, i) => (
          <div
            key={card.label}
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 16px #0001",
              padding: "28px 36px",              minWidth: 180,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              maxWidth: 250,
              borderTop: `5px solid ${card.color}`,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>{card.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 32, color: card.color }}>
              {loading ? "..." : summaryData[i]?.value}
            </div>
            <div style={{ color: "#555", fontWeight: 500, fontSize: 15, marginTop: 3 }}>{card.label}</div>
          </div>
        ))}
      </div>
      {error && <div style={{ color: 'red', marginBottom: 20 }}>{error}</div>}
      {/* Equipment Status Pie Chart */}
      <div style={{ display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px #0001", padding: 48, minWidth: 380, flex: 1, maxWidth: 540 }}>
          <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 22, color: "#2d5be3" }}>Equipment Status Overview</div>
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
            <div style={{ width: 240, height: 240 }}>
  <EquipmentStatusPieChart data={chartData} />
</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {chartData.map((d: {label: string, value: number, color: string}) => (
                <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ display: "inline-block", width: 18, height: 18, borderRadius: 5, background: d.color }}></span>
                  <span style={{ fontWeight: 600, color: "#222", minWidth: 120 }}>{d.label}</span>
                  <span style={{ fontWeight: 700, color: d.color }}>{loading ? "..." : d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Quick Info/Actions */}
        <div style={{ background: "linear-gradient(120deg, #2d5be3 60%, #6d41e3 100%)", borderRadius: 18, boxShadow: "0 2px 16px #0001", padding: 36, minWidth: 260, color: "#fff", flex: 1, maxWidth: 340, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>Quick Actions</div>
          <a href="/equipment" style={{ color: "#fff", fontWeight: 600, textDecoration: 'underline', fontSize: 17, marginBottom: 10 }}>View Equipments</a>
          <a href="/workorders" style={{ color: "#fff", fontWeight: 600, textDecoration: 'underline', fontSize: 17, marginBottom: 10 }}>Work Orders</a>
          <a href="/procurement" style={{ color: "#fff", fontWeight: 600, textDecoration: 'underline', fontSize: 17, marginBottom: 10 }}>Procurement</a>
          <a href="/incidents" style={{ color: "#fff", fontWeight: 600, textDecoration: 'underline', fontSize: 17, marginBottom: 10 }}>Incidents</a>
          <a href="/disposals" style={{ color: "#fff", fontWeight: 600, textDecoration: 'underline', fontSize: 17, marginBottom: 10 }}>Disposals</a>
        </div>
      </div>
      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 54, color: '#999', fontSize: 15, fontWeight: 500 }}>
        &copy; {new Date().getFullYear()} Vascular Equipment CMMS. All rights reserved.
      </div>
    </div>
  );
}
