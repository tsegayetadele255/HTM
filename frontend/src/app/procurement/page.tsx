"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface ProcurementRecord {
  id: number;
  item: string;
  amount: number;
  description?: string;
  supplier: string;
  status: string;
  expectedDeliveryDate: string;
  equipment?: { id: number; name: string } | null;
  requestedBy: { id: number; username: string };
  approvedBy?: { id: number; username: string } | null;
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

export default function ProcurementPage() {
  const [records, setRecords] = useState<ProcurementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [equipmentList, setEquipmentList] = useState<EquipmentSummary[]>([]);
  const [usersList, setUsersList] = useState<UserSummary[]>([]);
  const [form, setForm] = useState({
    item: '',
    amount: '',
    description: '',
    supplier: '',
    status: 'pending',
    expectedDeliveryDate: '',
    equipmentId: '',
    requestedById: '',
    approvedById: '',
  });

  function fetchRecords() {
    setLoading(true);
    axios.get("http://localhost:4000/api/procurement")
      .then(res => {
        setRecords(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load procurement records");
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
    setForm({ item: '', amount: '', description: '', supplier: '', status: 'pending', expectedDeliveryDate: '', equipmentId: '', requestedById: '', approvedById: '' });
    setShowModal(true);
    setSubmitError(null);
  }

  function openEditModal(record: ProcurementRecord) {
    setEditId(record.id);
    setForm({
      item: record.item || '',
      amount: record.amount?.toString() || '',
      description: record.description || '',
      supplier: record.supplier || '',
      status: record.status || 'pending',
      expectedDeliveryDate: record.expectedDeliveryDate ? record.expectedDeliveryDate.slice(0, 10) : '',
      equipmentId: record.equipment?.id?.toString() || '',
      requestedById: record.requestedBy?.id?.toString() || '',
      approvedById: record.approvedBy?.id?.toString() || '',
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
        item: form.item,
        amount: form.amount ? Number(form.amount) : undefined,
        description: form.description,
        supplier: form.supplier,
        status: form.status,
        expectedDeliveryDate: form.expectedDeliveryDate,
        equipmentId: form.equipmentId ? Number(form.equipmentId) : undefined,
        requestedById: form.requestedById ? Number(form.requestedById) : undefined,
        approvedById: form.approvedById ? Number(form.approvedById) : undefined,
      };
      if (!payload.item || !payload.amount || !payload.supplier || !payload.status || !payload.expectedDeliveryDate || !payload.requestedById) {
        throw new Error('All required fields must be filled');
      }
      if (editId) {
        await axios.put(`http://localhost:4000/api/procurement/${editId}`, payload);
      } else {
        await axios.post("http://localhost:4000/api/procurement", payload);
      }
      closeModal();
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'success',
        title: editId ? 'Procurement record updated' : 'Procurement record created',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      fetchRecords();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data) {
        const errorMsg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
        setSubmitError(errorMsg || 'Failed to save procurement record');
        Swal.fire('Failed', errorMsg || 'Failed to save procurement record', 'error');
      } else if (err instanceof Error) {
        setSubmitError(err.message);
        Swal.fire('Failed', err.message, 'error');
      } else {
        setSubmitError('Failed to save procurement record');
        Swal.fire('Failed', 'Failed to save procurement record', 'error');
      }
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Procurement record #${id} will be deleted!`,
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
      await axios.delete(`http://localhost:4000/api/procurement/${id}`);
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: 'Procurement record deleted',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      fetchRecords();
    } catch {
      Swal.fire('Failed', 'Failed to delete procurement record', 'error');
    }
  }

  return (
    <div style={{ padding: '1.5rem 0', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
        <button
          onClick={openAddModal}
          style={{ background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', letterSpacing: 0.2 }}
        >+ New Procurement Record</button>
        <h2 style={{ margin: 0 }}>Budget & Procurement</h2>
      </div>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0005', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 440, maxWidth: 540, boxShadow: '0 4px 32px #0002', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', fontSize: 24, color: '#999', cursor: 'pointer', fontWeight: 600 }}>&times;</button>
            <h3 style={{ margin: 0, marginBottom: 18 }}>{editId ? 'Edit Procurement Record' : 'Add New Procurement Record'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <input name="item" value={form.item} onChange={handleInput} placeholder="Item" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="amount" type="number" value={form.amount} onChange={handleInput} placeholder="Amount" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="supplier" value={form.supplier} onChange={handleInput} placeholder="Supplier" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="expectedDeliveryDate" type="date" value={form.expectedDeliveryDate} onChange={handleInput} required placeholder="Expected Delivery Date" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <select name="equipmentId" value={form.equipmentId} onChange={handleInput} style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15, gridColumn: '1 / -1' }}>
                  <option value="">Select Equipment (optional)</option>
                  {equipmentList.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.name}</option>
                  ))}
                </select>
                <select name="requestedById" value={form.requestedById} onChange={handleInput} required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }}>
                  <option value="">Requested By</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
                <select name="approvedById" value={form.approvedById} onChange={handleInput} style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }}>
                  <option value="">Approved By (optional)</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
                <input name="status" value={form.status} onChange={handleInput} placeholder="Status" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <textarea name="description" value={form.description} onChange={handleInput} placeholder="Description (optional)" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15, gridColumn: '1 / -1', minHeight: 60 }} />
                {submitError && <div style={{ color: 'red', gridColumn: '1 / -1', paddingTop: 4 }}>{submitError}</div>}
                <button type="submit" disabled={submitLoading} style={{ gridColumn: '1 / -1', background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 0', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: submitLoading ? 'not-allowed' : 'pointer', marginTop: 6 }}>
                  {submitLoading ? (editId ? 'Saving...' : 'Creating...') : (editId ? 'Save Changes' : 'Create Procurement Record')}
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
                {["Item", "Amount", "Supplier", "Status", "Requested By", "Approved By", "Expected Delivery", "Equipment", "Description", "Actions"].map((header, i) => (
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
                <tr><td colSpan={11} style={{ textAlign: 'center', padding: 32, color: '#999', background: '#fafbfc' }}>No procurement records found.</td></tr>
              ) : (
                records.map((rec, idx) => (
                  <tr key={rec.id} style={{
                    borderBottom: '1px solid #eee',
                    background: idx % 2 === 0 ? '#fff' : '#f7f8fa',
                    transition: 'background 0.2s',
                  }}>
                    <td style={{ padding: 10 }}>{rec.item}</td>
                    <td style={{ padding: 10 }}>{rec.amount}</td>
                    <td style={{ padding: 10 }}>{rec.supplier}</td>
                    <td style={{ padding: 10 }}>{rec.status}</td>
                    <td style={{ padding: 10 }}>{rec.requestedBy?.username || '-'}</td>
                    <td style={{ padding: 10 }}>{rec.approvedBy?.username || '-'}</td>
                    <td style={{ padding: 10 }}>{rec.expectedDeliveryDate ? rec.expectedDeliveryDate.slice(0, 10) : '-'}</td>
                    <td style={{ padding: 10 }}>{rec.equipment?.name || '-'}</td>
                    <td style={{ padding: 10, maxWidth: 180, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{rec.description && rec.description.length > 60 ? rec.description.slice(0, 60) + '…' : rec.description}</td>
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
