"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface Incident {
  id: number;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "investigating" | "resolved" | "closed";
  actionsTaken?: string;
  relatedEquipment: { id: number; name: string };
  reportedBy: { id: number; username: string };
  reportedAt: string;
  updatedAt: string;
}

interface EquipmentSummary {
  id: number;
  name: string;
}

interface UserSummary {
  id: number;
  username: string;
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [equipmentList, setEquipmentList] = useState<EquipmentSummary[]>([]);
  const [usersList, setUsersList] = useState<UserSummary[]>([]);
  const [form, setForm] = useState({
    description: '',
    severity: 'low',
    status: 'open',
    actionsTaken: '',
    relatedEquipmentId: '',
    reportedById: ''
  });

  function fetchIncidents() {
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/incidents`)
      .then(res => {
        setIncidents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load incidents");
        setLoading(false);
      });
  }

  function fetchEquipment() {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/equipment`)
      .then(res => setEquipmentList(res.data.map((e: EquipmentSummary) => ({ id: e.id, name: e.name }))))
      .catch(() => setEquipmentList([]));
  }

  function fetchUsers() {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`)
      .then(res => setUsersList(res.data.map((u: UserSummary) => ({ id: u.id, username: u.username }))))
      .catch(() => setUsersList([]));
  }

  useEffect(() => {
    fetchIncidents();
    fetchEquipment();
    fetchUsers();
  }, []);

  function openAddModal() {
    setEditId(null);
    setForm({ description: '', severity: 'low', status: 'open', actionsTaken: '', relatedEquipmentId: '', reportedById: '' });
    setShowModal(true);
    setSubmitError(null);
  }

  function openEditModal(incident: Incident) {
    setEditId(incident.id);
    setForm({
      description: incident.description || '',
      severity: incident.severity,
      status: incident.status,
      actionsTaken: incident.actionsTaken || '',
      relatedEquipmentId: incident.relatedEquipment?.id?.toString() || '',
      reportedById: incident.reportedBy?.id?.toString() || ''
    });
    setShowModal(true);
    setSubmitError(null);
  }

  function closeModal() {
    setShowModal(false);
    setEditId(null);
    setSubmitError(null);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      const payload = {
        description: form.description,
        severity: form.severity,
        status: form.status,
        actionsTaken: form.actionsTaken,
        relatedEquipmentId: form.relatedEquipmentId ? Number(form.relatedEquipmentId) : undefined,
        reportedById: form.reportedById ? Number(form.reportedById) : undefined
      };
      if (!payload.relatedEquipmentId || !payload.reportedById) throw new Error('Equipment and Reporter are required');
      if (editId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/incidents/${editId}`, payload);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/incidents`, payload);
      }
      closeModal();
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: editId ? 'Incident updated' : 'Incident reported',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      fetchIncidents();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data) {
        const errorMsg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
        setSubmitError(errorMsg || 'Failed to save incident');
        Swal.fire('Failed', errorMsg || 'Failed to save incident', 'error');
      } else if (err instanceof Error) {
        setSubmitError(err.message);
        Swal.fire('Failed', err.message, 'error');
      } else {
        setSubmitError('Failed to save incident');
        Swal.fire('Failed', 'Failed to save incident', 'error');
      }
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Incident #${id} will be deleted!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/incidents/${id}`);
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: 'Incident deleted',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      fetchIncidents();
    } catch {
      Swal.fire('Failed', 'Failed to delete incident', 'error');
    }
  }

  return (
    <div style={{ padding: '1.5rem 0', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
        <button
          onClick={openAddModal}
          style={{ background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', letterSpacing: 0.2 }}
        >+ Report Incident</button>
        <h2 style={{ margin: 0 }}>Incidents</h2>
      </div>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0005', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 440, maxWidth: 540, boxShadow: '0 4px 32px #0002', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', fontSize: 24, color: '#999', cursor: 'pointer', fontWeight: 600 }}>&times;</button>
            <h3 style={{ margin: 0, marginBottom: 18 }}>{editId ? 'Edit Incident' : 'Report New Incident'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <input name="description" value={form.description} onChange={handleInput} placeholder="Description" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15, gridColumn: '1 / -1' }} />
                <select name="severity" value={form.severity} onChange={handleInput} required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <select name="status" value={form.status} onChange={handleInput} required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }}>
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <textarea name="actionsTaken" value={form.actionsTaken} onChange={handleInput} placeholder="Actions Taken" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15, gridColumn: '1 / -1' }} />
                <select name="relatedEquipmentId" value={form.relatedEquipmentId} onChange={handleInput} required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }}>
                  <option value="">Select Equipment</option>
                  {equipmentList.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.name}</option>
                  ))}
                </select>
                <select name="reportedById" value={form.reportedById} onChange={handleInput} required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }}>
                  <option value="">Select Reporter</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
                {submitError && <div style={{ color: 'red', gridColumn: '1 / -1', paddingTop: 4 }}>{submitError}</div>}
                <button type="submit" disabled={submitLoading} style={{ gridColumn: '1 / -1', background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 0', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: submitLoading ? 'not-allowed' : 'pointer', marginTop: 6 }}>
                  {submitLoading ? (editId ? 'Saving...' : 'Reporting...') : (editId ? 'Save Changes' : 'Report Incident')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', padding: 32 }}>{error}</div>
      ) : (
        <div style={{ width: '100%', overflowX: 'auto', borderRadius: 16, boxShadow: '0 2px 16px #0002', border: '1px solid #e5e7ef', background: '#fff' }}>
          <table style={{ minWidth: 1000, width: '100%', borderCollapse: 'separate', borderSpacing: 0, borderRadius: 16, overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
                {["ID", "Description", "Severity", "Status", "Equipment", "Reporter", "Reported At", "Updated At", "Actions"].map((header, i) => (
                  <th
                    key={header}
                    style={{
                      padding: 12,
                      top: 0,
                      position: 'sticky',
                      zIndex: 2,
                      background: '#f5f6fa',
                      boxShadow: '0 2px 8px #0001',
                      fontWeight: 600,
                      fontSize: 15,
                      borderBottom: '1.5px solid #e5e7ef',
                      borderTopLeftRadius: i === 0 ? 16 : 0,
                      borderTopRightRadius: i === 8 ? 16 : 0
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {incidents.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 32, color: '#999', background: '#fafbfc' }}>No incidents found.</td></tr>
              ) : (
                incidents.map((i, idx) => (
                  <tr key={i.id} style={{
                    borderBottom: '1px solid #eee',
                    background: idx % 2 === 0 ? '#fff' : '#f7f8fa',
                    transition: 'background 0.2s',
                  }}>
                    <td style={{ padding: 10 }}>{i.id}</td>
                    <td style={{ padding: 10 }}>{i.description}</td>
                    <td style={{ padding: 10 }}>{i.severity}</td>
                    <td style={{ padding: 10 }}>{i.status}</td>
                    <td style={{ padding: 10 }}>{i.relatedEquipment?.name || '-'}</td>
                    <td style={{ padding: 10 }}>{i.reportedBy?.username || '-'}</td>
                    <td style={{ padding: 10 }}>{i.reportedAt ? i.reportedAt.slice(0, 19).replace('T', ' ') : '-'}</td>
                    <td style={{ padding: 10 }}>{i.updatedAt ? i.updatedAt.slice(0, 19).replace('T', ' ') : '-'}</td>
                    <td style={{ padding: 10, minWidth: 120 }}>
                      <button
                        onClick={() => openEditModal(i)}
                        style={{ background: '#f0f1fa', color: '#21243d', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 500, cursor: 'pointer', marginRight: 8, fontSize: 14, boxShadow: '0 1px 2px #0001' }}
                      >Edit</button>
                      <button
                        onClick={() => handleDelete(i.id)}
                        style={{ background: '#ffeded', color: '#d11a2a', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 500, cursor: 'pointer', fontSize: 14, boxShadow: '0 1px 2px #0001' }}
                      >Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
