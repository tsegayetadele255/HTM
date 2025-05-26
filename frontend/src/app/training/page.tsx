"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface TrainingRecord {
  id: number;
  topic: string;
  description?: string;
  date: string;
  trainee: { id: number; username: string };
  trainer: { id: number; username: string };
  certificateUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TrainingPage() {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  interface UserSummary {
  id: number;
  username: string;
}

const [usersList, setUsersList] = useState<UserSummary[]>([]);
  const [form, setForm] = useState({
    topic: '',
    description: '',
    date: '',
    traineeId: '',
    trainerId: '',
    certificateUrl: ''
  });

  function fetchRecords() {
    setLoading(true);
    axios.get("http://localhost:4000/api/training")
      .then(res => {
        setRecords(res.data);
        setLoading(false);
      })
      .catch(e => {
        setError("Failed to load training records");
        setLoading(false);
      });
  }

  function fetchUsers() {
    axios.get("http://localhost:4000/api/users")
      .then(res => setUsersList(res.data.map((u: UserSummary) => ({ id: u.id, username: u.username }))))
      .catch(() => setUsersList([]));
  }

  useEffect(() => {
    fetchRecords();
    fetchUsers();
  }, []);

  function openAddModal() {
    setEditId(null);
    setForm({ topic: '', description: '', date: '', traineeId: '', trainerId: '', certificateUrl: '' });
    setShowModal(true);
    setSubmitError(null);
  }

  function openEditModal(record: TrainingRecord) {
    setEditId(record.id);
    setForm({
      topic: record.topic || '',
      description: record.description || '',
      date: record.date ? record.date.slice(0, 10) : '',
      traineeId: record.trainee?.id?.toString() || '',
      trainerId: record.trainer?.id?.toString() || '',
      certificateUrl: record.certificateUrl || ''
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
      const payload: any = {
        topic: form.topic,
        description: form.description,
        date: form.date,
        traineeId: form.traineeId ? Number(form.traineeId) : undefined,
        trainerId: form.trainerId ? Number(form.trainerId) : undefined,
        certificateUrl: form.certificateUrl
      };
      if (!payload.traineeId || !payload.trainerId) throw new Error('Trainee and Trainer are required');
      if (editId) {
        await axios.put(`http://localhost:4000/api/training/${editId}`, payload);
      } else {
        await axios.post("http://localhost:4000/api/training", payload);
      }
      closeModal();
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: editId ? 'Training record updated' : 'Training record created',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      fetchRecords();
    } catch (err: any) {
      setSubmitError(err.response?.data?.error || err.message || 'Failed to save training record');
      Swal.fire('Failed', err.response?.data?.error || err.message || 'Failed to save training record', 'error');
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Training record #${id} will be deleted!`,
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
      await axios.delete(`http://localhost:4000/api/training/${id}`);
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: 'Training record deleted',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      fetchRecords();
    } catch (err) {
      Swal.fire('Failed', 'Failed to delete training record', 'error');
    }
  }

  return (
    <div style={{ padding: '1.5rem 0', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
        <button
          onClick={openAddModal}
          style={{ background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', letterSpacing: 0.2 }}
        >+ New Training</button>
        <h2 style={{ margin: 0 }}>Training Records</h2>
      </div>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0005', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 440, maxWidth: 540, boxShadow: '0 4px 32px #0002', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', fontSize: 24, color: '#999', cursor: 'pointer', fontWeight: 600 }}>&times;</button>
            <h3 style={{ margin: 0, marginBottom: 18 }}>{editId ? 'Edit Training Record' : 'Create New Training Record'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                <input name="topic" value={form.topic} onChange={handleInput} placeholder="Topic" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <textarea name="description" value={form.description} onChange={handleInput} placeholder="Description (optional)" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15, minHeight: 60 }} />
                <input name="date" value={form.date} onChange={handleInput} placeholder="Date" type="date" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <select name="traineeId" value={form.traineeId} onChange={handleInput} required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }}>
                  <option value="">Select Trainee</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
                <select name="trainerId" value={form.trainerId} onChange={handleInput} required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }}>
                  <option value="">Select Trainer</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
                <input name="certificateUrl" value={form.certificateUrl} onChange={handleInput} placeholder="Certificate URL (optional)" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                {submitError && <div style={{ color: 'red', paddingTop: 4 }}>{submitError}</div>}
                <button type="submit" disabled={submitLoading} style={{ background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 0', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: submitLoading ? 'not-allowed' : 'pointer', marginTop: 6 }}>
                  {submitLoading ? (editId ? 'Saving...' : 'Creating...') : (editId ? 'Save Changes' : 'Create Training Record')}
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
                {["ID", "Topic", "Description", "Date", "Trainee", "Trainer", "Certificate", "Created At", "Updated At", "Actions"].map((header, i) => (
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
                      borderTopRightRadius: i === 9 ? 16 : 0
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: 32, color: '#999', background: '#fafbfc' }}>No training records found.</td></tr>
              ) : (
                records.map((rec, idx) => (
                  <tr key={rec.id} style={{
                    borderBottom: '1px solid #eee',
                    background: idx % 2 === 0 ? '#fff' : '#f7f8fa',
                    transition: 'background 0.2s',
                  }}>
                    <td style={{ padding: 10 }}>{rec.id}</td>
                    <td style={{ padding: 10 }}>{rec.topic}</td>
                    <td style={{ padding: 10, maxWidth: 220, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{rec.description && rec.description.length > 120 ? rec.description.slice(0, 120) + '…' : rec.description}</td>
                    <td style={{ padding: 10 }}>{rec.date ? rec.date.slice(0, 10) : '-'}</td>
                    <td style={{ padding: 10 }}>{rec.trainee?.username || '-'}</td>
                    <td style={{ padding: 10 }}>{rec.trainer?.username || '-'}</td>
                    <td style={{ padding: 10 }}>{rec.certificateUrl ? <a href={rec.certificateUrl} target="_blank" rel="noopener noreferrer">View</a> : '-'}</td>
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
