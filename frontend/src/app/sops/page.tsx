"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface SOP {
  id: number;
  title: string;
  content: string;
  documentUrl?: string;
  createdBy: { id: number; username: string };
  createdAt: string;
  updatedAt: string;
}

export default function SOPsPage() {
  const [sops, setSOPs] = useState<SOP[]>([]);
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
    title: '',
    content: '',
    documentUrl: '',
    createdById: ''
  });

  function fetchSOPs() {
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/sops`)
      .then(res => {
        setSOPs(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load SOPs");
        setLoading(false);
      });
  }

  function fetchUsers() {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`)
      .then(res => setUsersList(res.data.map((u: UserSummary) => ({ id: u.id, username: u.username }))))
      .catch(() => setUsersList([]));
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchSOPs();
    fetchUsers();
  }, [fetchUsers]);

  function openAddModal() {
    setEditId(null);
    setForm({ title: '', content: '', documentUrl: '', createdById: '' });
    setShowModal(true);
    setSubmitError(null);
  }

  function openEditModal(sop: SOP) {
    setEditId(sop.id);
    setForm({
      title: sop.title || '',
      content: sop.content || '',
      documentUrl: sop.documentUrl || '',
      createdById: sop.createdBy?.id?.toString() || ''
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
        title: form.title,
        content: form.content,
        documentUrl: form.documentUrl,
        createdById: form.createdById ? Number(form.createdById) : undefined
      };
      if (!payload.createdById) throw new Error('Creator is required');
      if (editId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/sops/${editId}`, payload);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/sops`, payload);
      }
      closeModal();
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: editId ? 'SOP updated' : 'SOP created',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      fetchSOPs();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data) {
        const errorMsg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
        setSubmitError(errorMsg || 'Failed to save SOP');
        Swal.fire('Failed', errorMsg || 'Failed to save SOP', 'error');
      } else if (err instanceof Error) {
        setSubmitError(err.message);
        Swal.fire('Failed', err.message, 'error');
      } else {
        setSubmitError('Failed to save SOP');
        Swal.fire('Failed', 'Failed to save SOP', 'error');
      }
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `SOP #${id} will be deleted!`,
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
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/sops/${id}`);
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: 'SOP deleted',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      fetchSOPs();
    } catch {
      Swal.fire('Failed', 'Failed to delete SOP', 'error');
    }
  }

  return (
    <div style={{ padding: '1.5rem 0', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
        <button
          onClick={openAddModal}
          style={{ background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', letterSpacing: 0.2 }}
        >+ New SOP</button>
        <h2 style={{ margin: 0 }}>Standard Operating Procedures (SOPs)</h2>
      </div>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0005', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 440, maxWidth: 540, boxShadow: '0 4px 32px #0002', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', fontSize: 24, color: '#999', cursor: 'pointer', fontWeight: 600 }}>&times;</button>
            <h3 style={{ margin: 0, marginBottom: 18 }}>{editId ? 'Edit SOP' : 'Create New SOP'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                <input name="title" value={form.title} onChange={handleInput} placeholder="Title" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <textarea name="content" value={form.content} onChange={handleInput} placeholder="Content" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15, minHeight: 80 }} />
                <input name="documentUrl" value={form.documentUrl} onChange={handleInput} placeholder="Document URL (optional)" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <select name="createdById" value={form.createdById} onChange={handleInput} required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }}>
                  <option value="">Select Creator</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
                {submitError && <div style={{ color: 'red', paddingTop: 4 }}>{submitError}</div>}
                <button type="submit" disabled={submitLoading} style={{ background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 0', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: submitLoading ? 'not-allowed' : 'pointer', marginTop: 6 }}>
                  {submitLoading ? (editId ? 'Saving...' : 'Creating...') : (editId ? 'Save Changes' : 'Create SOP')}
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
                {["ID", "Title", "Content", "Document URL", "Creator", "Created At", "Updated At", "Actions"].map((header, i) => (
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
                      borderTopRightRadius: i === 7 ? 16 : 0
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sops.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: '#999', background: '#fafbfc' }}>No SOPs found.</td></tr>
              ) : (
                sops.map((sop, idx) => (
                  <tr key={sop.id} style={{
                    borderBottom: '1px solid #eee',
                    background: idx % 2 === 0 ? '#fff' : '#f7f8fa',
                    transition: 'background 0.2s',
                  }}>
                    <td style={{ padding: 10 }}>{sop.id}</td>
                    <td style={{ padding: 10 }}>{sop.title}</td>
                    <td style={{ padding: 10, maxWidth: 220, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{sop.content.length > 120 ? sop.content.slice(0, 120) + '…' : sop.content}</td>
                    <td style={{ padding: 10 }}>{sop.documentUrl ? <a href={sop.documentUrl} target="_blank" rel="noopener noreferrer">View</a> : '-'}</td>
                    <td style={{ padding: 10 }}>{sop.createdBy?.username || '-'}</td>
                    <td style={{ padding: 10 }}>{sop.createdAt ? sop.createdAt.slice(0, 19).replace('T', ' ') : '-'}</td>
                    <td style={{ padding: 10 }}>{sop.updatedAt ? sop.updatedAt.slice(0, 19).replace('T', ' ') : '-'}</td>
                    <td style={{ padding: 10, minWidth: 120 }}>
                      <button
                        onClick={() => openEditModal(sop)}
                        style={{ background: '#f0f1fa', color: '#21243d', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 500, cursor: 'pointer', marginRight: 8, fontSize: 14, boxShadow: '0 1px 2px #0001' }}
                      >Edit</button>
                      <button
                        onClick={() => handleDelete(sop.id)}
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
