"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface SparePart {
  id: number;
  name: string;
  stockLevel: number;
  expiryDate?: string;
  location?: string;
  manufacturer?: string;
  minStockLevel?: number;
  maxStockLevel?: number;
  equipmentType?: string;
  partNumber?: string;
  linkedEquipment?: { id: number; name: string } | null;
}

export default function SparePartsPage() {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/spareparts`)
      .then(res => {
        setSpareParts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load spare parts");
        setLoading(false);
      });
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    stockLevel: '',
    expiryDate: '',
    location: '',
    manufacturer: '',
    minStockLevel: '',
    maxStockLevel: '',
    equipmentType: '',
    partNumber: '',
    linkedEquipmentId: ''
  });
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  function openEditModal(sp: SparePart) {
    setEditId(sp.id);
    setForm({
      name: sp.name || '',
      stockLevel: sp.stockLevel?.toString() || '',
      expiryDate: sp.expiryDate ? sp.expiryDate.slice(0, 10) : '',
      location: sp.location || '',
      manufacturer: sp.manufacturer || '',
      minStockLevel: sp.minStockLevel?.toString() || '',
      maxStockLevel: sp.maxStockLevel?.toString() || '',
      equipmentType: sp.equipmentType || '',
      partNumber: sp.partNumber || '',
      linkedEquipmentId: sp.linkedEquipment?.id?.toString() || ''
    });
    setShowModal(true);
    setSubmitError(null);
  }

  async function handleDelete(id: number, name: string) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Spare part${name ? ` "${name}"` : ''} will be deleted!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });
    if (!result.isConfirmed) return;
    setDeleteLoading(id);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/spareparts/${id}`);
      setSpareParts(parts => parts.filter(p => p.id !== id));
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: 'Spare part deleted',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    } catch {
      Swal.fire('Failed', 'Failed to delete spare part', 'error');
    } finally {
      setDeleteLoading(null);
    }
  }
  interface EquipmentSummary {
    id: number;
    name: string;
  }

  const [equipmentList, setEquipmentList] = useState<EquipmentSummary[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/equipment`)
      .then(res => {
        setEquipmentList(res.data);
      });
  }, []);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function openModal() {
    setEditId(null);
    setForm({
      name: '', stockLevel: '', expiryDate: '', location: '', manufacturer: '', minStockLevel: '', maxStockLevel: '', equipmentType: '', partNumber: '', linkedEquipmentId: ''
    });
    setShowModal(true);
    setSubmitError(null);
  }
  function closeModal() {
    setShowModal(false);
    setEditId(null);
    setSubmitError(null);
  }
  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      const payload = {
        name: form.name,
        stockLevel: form.stockLevel ? Number(form.stockLevel) : 0,
        expiryDate: form.expiryDate || undefined,
        location: form.location || undefined,
        equipmentType: form.equipmentType || undefined,
        partNumber: form.partNumber || undefined,
        manufacturer: form.manufacturer || undefined,
        minStockLevel: form.minStockLevel ? Number(form.minStockLevel) : undefined,
        maxStockLevel: form.maxStockLevel ? Number(form.maxStockLevel) : undefined,
        linkedEquipmentId: form.linkedEquipmentId ? Number(form.linkedEquipmentId) : undefined
      };
      if (editId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/spareparts/${editId}`, payload);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/spareparts`, payload);
      }
      closeModal();
      setForm({ name: '', stockLevel: '', expiryDate: '', location: '', manufacturer: '', minStockLevel: '', maxStockLevel: '', equipmentType: '', partNumber: '', linkedEquipmentId: '' });
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: editId ? 'Spare part updated' : 'Spare part created',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      setLoading(true);
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/spareparts`)
        .then(res => {
          setSpareParts(res.data);
          setLoading(false);
        });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data) {
        const errorMsg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
        setSubmitError(errorMsg || 'Failed to create spare part');
        Swal.fire('Failed', errorMsg || 'Failed to create spare part', 'error');
      } else if (err instanceof Error) {
        setSubmitError(err.message || 'Failed to create spare part');
        Swal.fire('Failed', err.message || 'Failed to create spare part', 'error');
      } else {
        setSubmitError('Failed to create spare part');
        Swal.fire('Failed', 'Failed to create spare part', 'error');
      }
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <div style={{ padding: '1.5rem 0', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button
          style={{
            background: '#21243d', color: '#fff', border: 'none', padding: '10px 28px', borderRadius: 6,
            fontWeight: 600, cursor: 'pointer', fontSize: 16, boxShadow: '0 1px 2px #0002', marginRight: 18
          }}
          onClick={openModal}
        >
          + Add New Spare Part
        </button>
        <h2 style={{ margin: 0 }}>Spare Parts</h2>
      </div>
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0007', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
          onClick={closeModal}
        >
          <form
            onClick={e => e.stopPropagation()}
            onSubmit={handleSubmit}
            style={{
              background: '#fff', borderRadius: 18, padding: 32, minWidth: 400, maxWidth: 500, boxShadow: '0 2px 16px #0003', width: '100%'
            }}
          >
            <h3 style={{ marginTop: 0 }}>Create Spare Part</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input name="name" value={form.name} onChange={handleInput} placeholder="Name" required style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
              <input name="stockLevel" value={form.stockLevel} onChange={handleInput} placeholder="Stock Level" type="number" min={0} required style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
              <input name="minStockLevel" value={form.minStockLevel} onChange={handleInput} placeholder="Min Stock Level" type="number" min={0} style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
              <input name="maxStockLevel" value={form.maxStockLevel} onChange={handleInput} placeholder="Max Stock Level" type="number" min={0} style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
              <input name="expiryDate" value={form.expiryDate} onChange={handleInput} placeholder="Expiry Date" type="date" style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
              <input name="location" value={form.location} onChange={handleInput} placeholder="Location" style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
              <input name="manufacturer" value={form.manufacturer} onChange={handleInput} placeholder="Manufacturer" style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
              <input name="equipmentType" value={form.equipmentType} onChange={handleInput} placeholder="Equipment Type" style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
              <input name="partNumber" value={form.partNumber} onChange={handleInput} placeholder="Part Number" style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
              <select name="linkedEquipmentId" value={form.linkedEquipmentId} onChange={handleInput} style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }}>
                <option value="">Linked Equipment (optional)</option>
                {equipmentList.map(eq => (
                  <option key={eq.id} value={eq.id}>{eq.name}</option>
                ))}
              </select>
            </div>
            {submitError && <div style={{ color: 'red', marginTop: 12 }}>{submitError}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button type="button" onClick={closeModal} style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: '#eee', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={submitLoading} style={{ padding: '8px 24px', borderRadius: 6, border: 'none', background: '#21243d', color: '#fff', fontWeight: 600, cursor: submitLoading ? 'not-allowed' : 'pointer' }}>{submitLoading ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
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
                {["Name", "Stock", "Min", "Max", "Expiry", "Location", "Manufacturer", "Type", "Part #", "Linked Equipment"].map((header, i) => (
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
              {spareParts.length === 0 ? (
                <tr><td colSpan={11} style={{ textAlign: 'center', padding: 32, color: '#999', background: '#fafbfc' }}>No spare parts found.</td></tr>
              ) : (
                spareParts.map((sp, idx) => (
                  <tr key={sp.id} style={{
                    borderBottom: '1px solid #eee',
                    background: idx % 2 === 0 ? '#fff' : '#f7f8fa',
                    transition: 'background 0.2s',
                  }}>
                    <td style={{ padding: 10 }}>{sp.name}</td>
                    <td style={{ padding: 10 }}>{sp.stockLevel}</td>
                    <td style={{ padding: 10 }}>{sp.minStockLevel ?? '-'}</td>
                    <td style={{ padding: 10 }}>{sp.maxStockLevel ?? '-'}</td>
                    <td style={{ padding: 10 }}>{sp.expiryDate ? sp.expiryDate.slice(0, 10) : '-'}</td>
                    <td style={{ padding: 10 }}>{sp.location || '-'}</td>
                    <td style={{ padding: 10 }}>{sp.manufacturer || '-'}</td>
                    <td style={{ padding: 10 }}>{sp.equipmentType || '-'}</td>
                    <td style={{ padding: 10 }}>{sp.partNumber || '-'}</td>
                    <td style={{ padding: 10 }}>{sp.linkedEquipment?.name || '-'}</td>
                    <td style={{ padding: 10, minWidth: 120 }}>
                      <button
                        onClick={() => openEditModal(sp)}
                        style={{ background: '#f0f1fa', color: '#21243d', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 500, cursor: 'pointer', marginRight: 8, fontSize: 14, boxShadow: '0 1px 2px #0001' }}
                      >Edit</button>
                      <button
                        onClick={() => handleDelete(sp.id, sp.name)}
                        disabled={deleteLoading === sp.id}
                        style={{ background: '#ffeded', color: '#d11a2a', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 500, cursor: deleteLoading === sp.id ? 'not-allowed' : 'pointer', fontSize: 14, boxShadow: '0 1px 2px #0001', opacity: deleteLoading === sp.id ? 0.6 : 1 }}
                      >{deleteLoading === sp.id ? 'Deleting...' : 'Delete'}</button>
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
