"use client";
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

interface DisposalRecord {
  id: number;
  equipment: { id: number; name: string };
  reason: string;
  method: string;
  notes?: string;
  disposedBy: { id: number; username: string };
  disposalDate: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EquipmentSummary {
  id: number;
  name: string;
}

interface UserSummary {
  id: number;
  username: string;
}

export default function DisposalsPage() {
  const [records, setRecords] = useState<DisposalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [equipmentList, setEquipmentList] = useState<EquipmentSummary[]>([]);
  const [usersList, setUsersList] = useState<UserSummary[]>([]);
  const [form, setForm] = useState({
    equipmentId: '',
    reason: '',
    method: '',
    notes: '',
    disposedById: '',
    disposalDate: '',
    status: 'pending',
  });

  function fetchRecords() {
    setLoading(true);
    axios.get("http://localhost:4000/api/disposals")
      .then(res => {
        setRecords(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load disposal records");
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
    setForm({ equipmentId: '', reason: '', method: '', notes: '', disposedById: '', disposalDate: '', status: 'pending' });
    setShowModal(true);
    setSubmitError(null);
  }

  function openEditModal(record: DisposalRecord) {
    setEditId(record.id);
    setForm({
      equipmentId: record.equipment?.id?.toString() || '',
      reason: record.reason || '',
      method: record.method || '',
      notes: record.notes || '',
      disposedById: record.disposedBy?.id?.toString() || '',
      disposalDate: record.disposalDate ? record.disposalDate.slice(0, 10) : '',
      status: record.status || 'pending',
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
        reason: form.reason,
        method: form.method,
        notes: form.notes,
        disposedById: form.disposedById ? Number(form.disposedById) : undefined,
        disposalDate: form.disposalDate,
        status: form.status,
      };
      if (!payload.equipmentId || !payload.disposedById || !payload.reason || !payload.method || !payload.disposalDate) {
        throw new Error('All required fields must be filled');
      }
      if (editId) {
        await axios.put(`http://localhost:4000/api/disposals/${editId}`, payload);
      } else {
        await axios.post("http://localhost:4000/api/disposals", payload);
      }
      closeModal();
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: editId ? 'Disposal record updated' : 'Disposal record created',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      fetchRecords();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data) {
        const errorMsg = (err as AxiosError)?.response?.data && typeof (err as AxiosError).response?.data === 'object' && 'error' in (err as AxiosError).response?.data
          ? ((err as AxiosError).response?.data as { error: string }).error
          : undefined;
        setSubmitError(errorMsg || 'Failed to save disposal record');
        Swal.fire('Failed', errorMsg || 'Failed to save disposal record', 'error');
      } else if (err instanceof Error) {
        setSubmitError(err.message);
        Swal.fire('Failed', err.message, 'error');
      } else {
        setSubmitError('Failed to save disposal record');
        Swal.fire('Failed', 'Failed to save disposal record', 'error');
      }
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Disposal record #${id} will be deleted!`,
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
      await axios.delete(`http://localhost:4000/api/disposals/${id}`);
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: 'Disposal record deleted',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      fetchRecords();
    } catch {
      Swal.fire('Failed', 'Failed to delete disposal record', 'error');
    }
  }

  return (
    <div style={{ padding: '1.5rem 0', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
        <button
          onClick={openAddModal}
          style={{ background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', letterSpacing: 0.2 }}
        >+ New Disposal Record</button>
        <h2 style={{ margin: 0 }}>Disposal & Decommissioning</h2>
      </div>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0005', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 440, maxWidth: 540, boxShadow: '0 4px 32px #0002', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', fontSize: 24, color: '#999', cursor: 'pointer', fontWeight: 600 }}>&times;</button>
            <h3 style={{ margin: 0, marginBottom: 18 }}>{editId ? 'Edit Disposal Record' : 'Add New Disposal Record'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <select name="equipmentId" value={form.equipmentId} onChange={handleInput} required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15, gridColumn: '1 / -1' }}>
                  <option value="">Select Equipment</option>
                  {equipmentList.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.name}</option>
                  ))}
                </select>
                <select name="disposedById" value={form.disposedById} onChange={handleInput} required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15, gridColumn: '1 / -1' }}>
                  <option value="">Disposed By</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
                <input name="disposalDate" type="date" value={form.disposalDate} onChange={handleInput} required placeholder="Disposal Date" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="reason" value={form.reason} onChange={handleInput} placeholder="Reason" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="method" value={form.method} onChange={handleInput} placeholder="Method" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="status" value={form.status} onChange={handleInput} placeholder="Status" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <textarea name="notes" value={form.notes} onChange={handleInput} placeholder="Notes (optional)" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15, gridColumn: '1 / -1', minHeight: 60 }} />
                {submitError && <div style={{ color: 'red', gridColumn: '1 / -1', paddingTop: 4 }}>{submitError}</div>}
                <button type="submit" disabled={submitLoading} style={{ gridColumn: '1 / -1', background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 0', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: submitLoading ? 'not-allowed' : 'pointer', marginTop: 6 }}>
                  {submitLoading ? (editId ? 'Saving...' : 'Creating...') : (editId ? 'Save Changes' : 'Create Disposal Record')}
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
                {["ID", "Equipment", "Reason", "Method", "Status", "Disposed By", "Disposal Date", "Notes", "Actions"].map((header, i) => (
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
              {records.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 32, color: '#999', background: '#fafbfc' }}>No disposal records found.</td></tr>
              ) : (
                records.map((rec, idx) => (
                  <tr key={rec.id} style={{
                    borderBottom: '1px solid #eee',
                    background: idx % 2 === 0 ? '#fff' : '#f7f8fa',
                    transition: 'background 0.2s',
                  }}>
                    <td style={{ padding: 10 }}>{rec.id}</td>
                    <td style={{ padding: 10 }}>{rec.equipment?.name || '-'}</td>
                    <td style={{ padding: 10 }}>{rec.reason}</td>
                    <td style={{ padding: 10 }}>{rec.method}</td>
                    <td style={{ padding: 10 }}>{rec.status}</td>
                    <td style={{ padding: 10 }}>{rec.disposedBy?.username || '-'}</td>
                    <td style={{ padding: 10 }}>{rec.disposalDate ? rec.disposalDate.slice(0, 10) : '-'}</td>
                    <td style={{ padding: 10, maxWidth: 180, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{rec.notes && rec.notes.length > 60 ? rec.notes.slice(0, 60) + '…' : rec.notes}</td>
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
