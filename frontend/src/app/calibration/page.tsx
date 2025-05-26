"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface CalibrationRecord {
  id: number;
  equipment: { id: number; name: string };
  calibrationDate: string;
  dueDate: string;
  performedBy: { id: number; username: string };
  certificateUrl?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CalibrationPage() {
  const [records, setRecords] = useState<CalibrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  interface EquipmentSummary { id: number; name: string }
interface UserSummary { id: number; username: string }
const [equipmentList, setEquipmentList] = useState<EquipmentSummary[]>([]);
  const [usersList, setUsersList] = useState<UserSummary[]>([]);
  const [form, setForm] = useState({
    equipmentId: '',
    calibrationDate: '',
    dueDate: '',
    performedById: '',
    certificateUrl: '',
    status: 'pending',
    notes: ''
  });

  function fetchRecords() {
    setLoading(true);
    axios.get("http://localhost:4000/api/calibration")
      .then(res => {
        setRecords(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load calibration records");
        setLoading(false);
      });
  }

  function fetchEquipment() {
    axios.get("http://localhost:4000/api/equipment")
      .then(res => setEquipmentList(res.data.map((e: EquipmentSummary) => ({ id: e.id, name: e.name }))))
      .catch(() => setEquipmentList([]));
  }

  function fetchUsers() {
    axios.get("http://localhost:4000/api/users")
      .then(res => setUsersList(res.data.map((u: UserSummary) => ({ id: u.id, username: u.username }))))
      .catch(() => setUsersList([]));
  }

  useEffect(() => {
    fetchRecords();
    fetchEquipment();
    fetchUsers();
  }, []);

  function openAddModal() {
    setEditId(null);
    setForm({ equipmentId: '', calibrationDate: '', dueDate: '', performedById: '', certificateUrl: '', status: 'pending', notes: '' });
    setShowModal(true);
    setSubmitError(null);
  }

  function openEditModal(record: CalibrationRecord) {
    setEditId(record.id);
    setForm({
      equipmentId: record.equipment?.id?.toString() || '',
      calibrationDate: record.calibrationDate ? record.calibrationDate.slice(0, 10) : '',
      dueDate: record.dueDate ? record.dueDate.slice(0, 10) : '',
      performedById: record.performedBy?.id?.toString() || '',
      certificateUrl: record.certificateUrl || '',
      status: record.status || 'pending',
      notes: record.notes || ''
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
        equipmentId: form.equipmentId ? Number(form.equipmentId) : undefined,
        calibrationDate: form.calibrationDate,
        dueDate: form.dueDate,
        performedById: form.performedById ? Number(form.performedById) : undefined,
        certificateUrl: form.certificateUrl,
        status: form.status,
        notes: form.notes
      };
      if (!payload.equipmentId || !payload.performedById) throw new Error('Equipment and Performed By are required');
      if (editId) {
        await axios.put(`http://localhost:4000/api/calibration/${editId}`, payload);
      } else {
        await axios.post("http://localhost:4000/api/calibration", payload);
      }
      closeModal();
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: editId ? 'Calibration record updated' : 'Calibration record created',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      fetchRecords();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
        Swal.fire('Failed', err.message, 'error');
      } else {
        setSubmitError('Failed to save calibration record');
        Swal.fire('Failed', 'Failed to save calibration record', 'error');
      }
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Calibration record #${id} will be deleted!`,
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
      await axios.delete(`http://localhost:4000/api/calibration/${id}`);
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: 'Calibration record deleted',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      fetchRecords();
    } catch {
      Swal.fire('Failed', 'Failed to delete calibration record', 'error');
    
      Swal.fire('Failed', 'Failed to delete calibration record', 'error');
    }
  }

  return (
    <div style={{ padding: '1.5rem 0', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
        <button
          onClick={openAddModal}
          style={{ background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', letterSpacing: 0.2 }}
        >+ New Calibration</button>
        <h2 style={{ margin: 0 }}>Calibration Records</h2>
      </div>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0005', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 440, maxWidth: 540, boxShadow: '0 4px 32px #0002', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', fontSize: 24, color: '#999', cursor: 'pointer', fontWeight: 600 }}>&times;</button>
            <h3 style={{ margin: 0, marginBottom: 18 }}>{editId ? 'Edit Calibration Record' : 'Create New Calibration Record'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                <select name="equipmentId" value={form.equipmentId} onChange={handleInput} required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }}>
                  <option value="">Select Equipment</option>
                  {equipmentList.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
                <input name="calibrationDate" value={form.calibrationDate} onChange={handleInput} placeholder="Calibration Date" type="date" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="dueDate" value={form.dueDate} onChange={handleInput} placeholder="Due Date" type="date" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <select name="performedById" value={form.performedById} onChange={handleInput} required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }}>
                  <option value="">Performed By</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
                <input name="certificateUrl" value={form.certificateUrl} onChange={handleInput} placeholder="Certificate URL (optional)" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <select name="status" value={form.status} onChange={handleInput} required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }}>
                  <option value="pending">Pending</option>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                </select>
                <textarea name="notes" value={form.notes} onChange={handleInput} placeholder="Notes (optional)" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15, minHeight: 60 }} />
                {submitError && <div style={{ color: 'red', paddingTop: 4 }}>{submitError}</div>}
                <button type="submit" disabled={submitLoading} style={{ background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 0', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: submitLoading ? 'not-allowed' : 'pointer', marginTop: 6 }}>
                  {submitLoading ? (editId ? 'Saving...' : 'Creating...') : (editId ? 'Save Changes' : 'Create Calibration Record')}
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
                {["ID", "Equipment", "Calibration Date", "Due Date", "Performed By", "Certificate", "Status", "Notes", "Created At", "Updated At", "Actions"].map((header, i) => (
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
                      borderTopRightRadius: i === 10 ? 16 : 0
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan={11} style={{ textAlign: 'center', padding: 32, color: '#999', background: '#fafbfc' }}>No calibration records found.</td></tr>
              ) : (
                records.map((rec, idx) => (
                  <tr key={rec.id} style={{
                    borderBottom: '1px solid #eee',
                    background: idx % 2 === 0 ? '#fff' : '#f7f8fa',
                    transition: 'background 0.2s',
                  }}>
                    <td style={{ padding: 10 }}>{rec.id}</td>
                    <td style={{ padding: 10 }}>{rec.equipment?.name || '-'}</td>
                    <td style={{ padding: 10 }}>{rec.calibrationDate ? rec.calibrationDate.slice(0, 10) : '-'}</td>
                    <td style={{ padding: 10 }}>{rec.dueDate ? rec.dueDate.slice(0, 10) : '-'}</td>
                    <td style={{ padding: 10 }}>{rec.performedBy?.username || '-'}</td>
                    <td style={{ padding: 10 }}>{rec.certificateUrl ? <a href={rec.certificateUrl} target="_blank" rel="noopener noreferrer">View</a> : '-'}</td>
                    <td style={{ padding: 10 }}>{rec.status}</td>
                    <td style={{ padding: 10, maxWidth: 180, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{rec.notes && rec.notes.length > 80 ? rec.notes.slice(0, 80) + '…' : rec.notes}</td>
                    <td style={{ padding: 10 }}>{rec.createdAt ? rec.createdAt.slice(0, 19).replace('T', ' ') : '-'}</td>
                    <td style={{ padding: 10 }}>{rec.updatedAt ? rec.updatedAt.slice(0, 19).replace('T', ' ') : '-'}</td>
                    <td style={{ padding: 10, minWidth: 120 }}>
                      <button
                        onClick={() => openEditModal(rec)}
                        style={{ background: '#f0f1fa', color: '#21243d', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 500, cursor: 'pointer', marginRight: 8, fontSize: 14, boxShadow: '0 1px 2px #0001' }}
                      >Edit</button>
                      <button
                        onClick={() => handleDelete(rec.id)}
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
