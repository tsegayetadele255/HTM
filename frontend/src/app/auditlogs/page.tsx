"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface AuditLog {
  id: number;
  action: string;
  entityType?: string;
  entityId?: number;
  details?: string;
  user?: { id: number; username: string };
  timestamp: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [usersList, setUsersList] = useState<{ id: number; username: string }[]>([]);
  const [form, setForm] = useState({
    action: '',
    entityType: '',
    entityId: '',
    details: '',
    userId: ''
  });

  function fetchLogs() {
    setLoading(true);
    axios.get("http://localhost:4000/api/auditlogs")
      .then(res => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load audit logs");
        setLoading(false);
      });
  }

  function fetchUsers() {
    axios.get("http://localhost:4000/api/users")
      .then(res => setUsersList(res.data.map((u: any) => ({ id: u.id, username: u.username }))))
      .catch(() => setUsersList([]));
  }

  useEffect(() => {
    fetchLogs();
    fetchUsers();
  }, []);

  function openAddModal() {
    setEditId(null);
    setForm({ action: '', entityType: '', entityId: '', details: '', userId: '' });
    setShowModal(true);
    setSubmitError(null);
  }

  function openEditModal(log: AuditLog) {
    setEditId(log.id);
    setForm({
      action: log.action || '',
      entityType: log.entityType || '',
      entityId: log.entityId?.toString() || '',
      details: log.details || '',
      userId: log.user?.id?.toString() || ''
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
        action: form.action,
        entityType: form.entityType,
        entityId: form.entityId ? Number(form.entityId) : undefined,
        details: form.details,
        userId: form.userId ? Number(form.userId) : undefined
      };
      if (!payload.action) throw new Error('Action is required');
      if (form.userId && !payload.userId) throw new Error('Invalid user');
      if (editId) {
        await axios.put(`http://localhost:4000/api/auditlogs/${editId}`, payload);
      } else {
        await axios.post("http://localhost:4000/api/auditlogs", payload);
      }
      closeModal();
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: editId ? 'Audit log updated' : 'Audit log created',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      fetchLogs();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
        Swal.fire('Failed', err.message, 'error');
      } else {
        setSubmitError('Failed to save audit log');
        Swal.fire('Failed', 'Failed to save audit log', 'error');
      }
    
      setSubmitError(err.response?.data?.error || err.message || 'Failed to save audit log');
      Swal.fire('Failed', err.response?.data?.error || err.message || 'Failed to save audit log', 'error');
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Audit log #${id} will be deleted!`,
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
      await axios.delete(`http://localhost:4000/api/auditlogs/${id}`);
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: 'Audit log deleted',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      fetchLogs();
    } catch {
      Swal.fire('Failed', 'Failed to delete audit log', 'error');
    
      Swal.fire('Failed', 'Failed to delete audit log', 'error');
    }
  }

  return (
    <div style={{ padding: '1.5rem 0', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
        <button
          onClick={openAddModal}
          style={{ background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', letterSpacing: 0.2 }}
        >+ New Audit Log</button>
        <h2 style={{ margin: 0 }}>Audit Logs</h2>
      </div>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0005', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 440, maxWidth: 540, boxShadow: '0 4px 32px #0002', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', fontSize: 24, color: '#999', cursor: 'pointer', fontWeight: 600 }}>&times;</button>
            <h3 style={{ margin: 0, marginBottom: 18 }}>{editId ? 'Edit Audit Log' : 'Create New Audit Log'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                <input name="action" value={form.action} onChange={handleInput} placeholder="Action" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="entityType" value={form.entityType} onChange={handleInput} placeholder="Entity Type (optional)" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="entityId" value={form.entityId} onChange={handleInput} placeholder="Entity ID (optional)" type="number" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <textarea name="details" value={form.details} onChange={handleInput} placeholder="Details (optional)" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15, minHeight: 60 }} />
                <select name="userId" value={form.userId} onChange={handleInput} style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }}>
                  <option value="">Select User (optional)</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
                {submitError && <div style={{ color: 'red', paddingTop: 4 }}>{submitError}</div>}
                <button type="submit" style={{ background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', letterSpacing: 0.2 }} disabled={submitLoading}>
                  {submitLoading ? (editId ? 'Saving...' : 'Creating...') : (editId ? 'Save Changes' : 'Create Audit Log')}
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
          <table style={{ minWidth: 900, width: '100%', borderCollapse: 'separate', borderSpacing: 0, borderRadius: 16, overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
                {["ID", "Action", "Entity Type", "Entity ID", "Details", "User", "Timestamp", "Actions"].map((header, i) => (
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
                      borderTopRightRadius: i === 6 ? 16 : 0
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#999', background: '#fafbfc' }}>No audit logs found.</td></tr>
              ) : (
                logs.map((log, idx) => (
                  <tr key={log.id} style={{
                    borderBottom: '1px solid #eee',
                    background: idx % 2 === 0 ? '#fff' : '#f7f8fa',
                    transition: 'background 0.2s',
                  }}>
                    <td style={{ padding: 10 }}>{log.id}</td>
                    <td style={{ padding: 10 }}>{log.action}</td>
                    <td style={{ padding: 10 }}>{log.entityType || '-'}</td>
                    <td style={{ padding: 10 }}>{log.entityId || '-'}</td>
                    <td style={{ padding: 10, maxWidth: 220, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{log.details && log.details.length > 120 ? log.details.slice(0, 120) + '…' : log.details}</td>
                    <td style={{ padding: 10 }}>{log.user?.username || '-'}</td>
                    <td style={{ padding: 10 }}>{log.timestamp ? log.timestamp.slice(0, 19).replace('T', ' ') : '-'}</td>
                    <td style={{ padding: 10, minWidth: 120 }}>
                      <button
                        onClick={() => openEditModal(log)}
                        style={{ background: '#f0f1fa', color: '#21243d', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 500, cursor: 'pointer', marginRight: 8, fontSize: 14, boxShadow: '0 1px 2px #0001' }}
                      >Edit</button>
                      <button
                        onClick={() => handleDelete(log.id)}
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
