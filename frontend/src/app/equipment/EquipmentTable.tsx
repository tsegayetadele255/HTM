"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export interface Equipment {
  id: number;
  name: string;
  manufacturer: string;
  model: string;
  serial: string;
  location: string;
  department: string;
  status: string;
  risk: string;
  serviceLocation?: string;
  operator?: string;
  condition?: string;
  lifespan?: string;
  power?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  maintenanceInterval?: string;
  lastMaintenanceDate?: string;
  notes?: string;
}

export default function EquipmentTable() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    manufacturer: "",
    model: "",
    serial: "",
    location: "",
    department: "",
    status: "",
    risk: "",
    serviceLocation: "",
    operator: "",
    condition: "",
    lifespan: "",
    power: "",
    purchaseDate: "",
    warrantyExpiry: "",
    maintenanceInterval: "",
    lastMaintenanceDate: "",
    notes: ""
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const openAddModal = () => {
    setEditId(null);
    setForm({
      name: "",
      manufacturer: "",
      model: "",
      serial: "",
      location: "",
      department: "",
      status: "",
      risk: "",
      serviceLocation: "",
      operator: "",
      condition: "",
      lifespan: "",
      power: "",
      purchaseDate: "",
      warrantyExpiry: "",
      maintenanceInterval: "",
      lastMaintenanceDate: "",
      notes: ""
    });
    setShowModal(true);
  };

  const openEditModal = (eq: Equipment) => {
    setEditId(eq.id);
    setForm({
      name: eq.name || "",
      manufacturer: eq.manufacturer || "",
      model: eq.model || "",
      serial: eq.serial || "",
      location: eq.location || "",
      department: eq.department || "",
      status: eq.status || "",
      risk: eq.risk || "",
      serviceLocation: eq.serviceLocation || "",
      operator: eq.operator || "",
      condition: eq.condition || "",
      lifespan: eq.lifespan || "",
      power: eq.power || "",
      purchaseDate: eq.purchaseDate ? eq.purchaseDate.substring(0, 10) : "",
      warrantyExpiry: eq.warrantyExpiry ? eq.warrantyExpiry.substring(0, 10) : "",
      maintenanceInterval: eq.maintenanceInterval || "",
      lastMaintenanceDate: eq.lastMaintenanceDate ? eq.lastMaintenanceDate.substring(0, 10) : "",
      notes: eq.notes || ""
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setSubmitError(null);
  };

  const defaultForm = {
    name: "",
    manufacturer: "",
    model: "",
    serial: "",
    location: "",
    department: "",
    status: "",
    risk: "",
    serviceLocation: "",
    operator: "",
    condition: "",
    lifespan: "",
    power: "",
    purchaseDate: "",
    warrantyExpiry: "",
    maintenanceInterval: "",
    lastMaintenanceDate: "",
    notes: ""
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      if (editId) {
        await axios.put(`http://localhost:4000/api/equipment/${editId}`, form);
      } else {
        await axios.post("http://localhost:4000/api/equipment", form);
      }
      closeModal();
      setForm(defaultForm);
      fetchEquipment();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Failed to save equipment");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // SweetAlert2 delete logic
  const handleDelete = async (id: number, name?: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Equipment${name ? ` "${name}"` : ''} will be deleted!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });
    if (result.isConfirmed) {
      setDeleteLoading(id);
      try {
        await axios.delete(`http://localhost:4000/api/equipment/${id}`);
        fetchEquipment();
        Swal.fire({
          toast: true,
          position: 'bottom',
          icon: 'success',
          title: 'Equipment deleted',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
      } catch {
        Swal.fire('Failed', 'Failed to delete equipment', 'error');
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  async function fetchEquipment() {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/equipment");
      setEquipment(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEquipment();
  }, []);

  if (loading) return <div>Loading equipment...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0001", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button
          onClick={openAddModal}
          style={{ background: "#21243d", color: "#fff", border: "none", padding: "10px 18px", borderRadius: 6, fontWeight: 600, cursor: "pointer", boxShadow: '0 2px 8px #0002', transition: 'background 0.2s' }}
          onMouseOver={e => (e.currentTarget.style.background = '#363a55')}
          onMouseOut={e => (e.currentTarget.style.background = '#21243d')}
        >
          + Add New Vascular Equipment
        </button>
        <h2 style={{ margin: 0 }}>Equipment</h2>
      </div>

      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#0008",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}
          onClick={closeModal}
        >
          <form
            onClick={e => e.stopPropagation()}
            onSubmit={handleSubmit}
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 0,
              minWidth: 800,
              maxWidth: 1100,
              width: '90vw',
              boxShadow: "0 8px 40px #0003, 0 2px 8px #0001",
              position: 'relative',
              fontSize: 17,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <button type="button" onClick={closeModal} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }} aria-label="Close">×</button>
            <h3 style={{ marginTop: 0, marginBottom: 8, textAlign: 'center', fontWeight: 700, letterSpacing: 0.5 }}>{editId ? 'Edit Equipment' : 'Add New Vascular Equipment'}</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 20,
              marginBottom: 20
            }}>
              {editId !== null && <label style={{ fontWeight: 500, gridColumn: '1/-1' }}>ID<input value={editId} readOnly style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #eee', background: '#f5f5f5', color: '#999' }} /></label>}
              <label style={{ fontWeight: 500 }}>Name<input name="name" required value={form.name} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', boxShadow: '0 1px 2px #0001' }} /></label>
              <label style={{ fontWeight: 500 }}>Manufacturer<input name="manufacturer" required value={form.manufacturer} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', boxShadow: '0 1px 2px #0001' }} /></label>
              <label style={{ fontWeight: 500 }}>Model<input name="model" value={form.model} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', boxShadow: '0 1px 2px #0001' }} /></label>
              <label style={{ fontWeight: 500 }}>Serial Number<input name="serial" value={form.serial} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', boxShadow: '0 1px 2px #0001' }} /></label>
              <label style={{ fontWeight: 500 }}>Location<input name="location" value={form.location} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', boxShadow: '0 1px 2px #0001' }} /></label>
              <label style={{ fontWeight: 500 }}>Department<input name="department" value={form.department} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', boxShadow: '0 1px 2px #0001' }} /></label>
              <label style={{ fontWeight: 500 }}>Status
                <select name="status" value={form.status} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', boxShadow: '0 1px 2px #0001' }}>
                  <option value="">Select status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="decommissioned">Decommissioned</option>
                </select>
              </label>
              <label style={{ fontWeight: 500 }}>Risk<input name="risk" value={form.risk} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', boxShadow: '0 1px 2px #0001' }} /></label>
              <label style={{ fontWeight: 500 }}>Service Location<input name="serviceLocation" value={form.serviceLocation} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', boxShadow: '0 1px 2px #0001' }} /></label>
              <label style={{ fontWeight: 500 }}>Operator<input name="operator" value={form.operator} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', boxShadow: '0 1px 2px #0001' }} /></label>
              <label style={{ fontWeight: 500 }}>Condition<input name="condition" value={form.condition} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', boxShadow: '0 1px 2px #0001' }} /></label>
              <label style={{ fontWeight: 500 }}>Lifespan<input name="lifespan" value={form.lifespan} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', boxShadow: '0 1px 2px #0001' }} /></label>
              <label style={{ fontWeight: 500 }}>Power<input name="power" value={form.power} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', boxShadow: '0 1px 2px #0001' }} /></label>
              <label style={{ fontWeight: 500 }}>Purchase Date<input name="purchaseDate" type="date" value={form.purchaseDate} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', boxShadow: '0 1px 2px #0001' }} /></label>
              <label style={{ fontWeight: 500 }}>Warranty Expiry<input name="warrantyExpiry" type="date" value={form.warrantyExpiry} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', boxShadow: '0 1px 2px #0001' }} /></label>
              <label style={{ fontWeight: 500 }}>Maintenance Interval<input name="maintenanceInterval" value={form.maintenanceInterval} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', boxShadow: '0 1px 2px #0001' }} /></label>
              <label style={{ fontWeight: 500 }}>Last Maintenance Date<input name="lastMaintenanceDate" type="date" value={form.lastMaintenanceDate} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', boxShadow: '0 1px 2px #0001' }} /></label>
              <label style={{ fontWeight: 500, gridColumn: '1/-1' }}>Notes<textarea name="notes" value={form.notes} onChange={handleInput} style={{ width: "100%", padding: 8, marginTop: 2, borderRadius: 6, border: '1px solid #ccc', outline: 'none', minHeight: 60, boxShadow: '0 1px 2px #0001', resize: 'vertical' }} /></label>
            </div>
            {submitError && <div style={{ color: "red", textAlign: 'center', gridColumn: '1/-1', marginBottom: 8 }}>{submitError}</div>}
            <div style={{
              display: "flex",
              gap: 12,
              marginTop: 16,
              justifyContent: 'center',
              padding: '0 40px 32px 40px',
              position: 'sticky',
              bottom: 0,
              background: '#fff',
              zIndex: 2,
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18
            }}>
              <button type="submit" disabled={submitLoading} style={{ background: "#21243d", color: "#fff", border: "none", padding: "10px 28px", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: 16 }}>
                {submitLoading ? (editId ? "Saving..." : "Adding...") : (editId ? "Save Changes" : "Add Equipment")}
              </button>
              <button type="button" onClick={closeModal} style={{ background: "#eee", color: "#222", border: "none", padding: "10px 24px", borderRadius: 6, fontWeight: 500, cursor: "pointer", fontSize: 16 }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ width: '100%', overflowX: 'auto', borderRadius: 16, boxShadow: '0 2px 16px #0002', border: '1px solid #e5e7ef', background: '#fff' }}>
        <table style={{ minWidth: 1100, width: '100%', borderCollapse: 'separate', borderSpacing: 0, borderRadius: 16, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
              {['Name','Manufacturer','Model','Serial','Location','Department','Status','Operator','Lifespan','Power','Purchase Date','Warranty Expiry','Maintenance Interval','Last Maintenance Date','Actions'].map((header, i) => (
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
                    borderTopRightRadius: i === 13 ? 16 : 0
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {equipment.length === 0 ? (
              <tr><td colSpan={16} style={{ textAlign: 'center', padding: 32, color: '#999', background: '#fafbfc' }}>No equipment found.</td></tr>
            ) : (
              equipment.map((eq, idx) => (
                <tr key={eq.id} style={{
                  borderBottom: '1px solid #eee',
                  background: idx % 2 === 0 ? '#fff' : '#f7f8fa',
                  transition: 'background 0.2s',
                  // ':hover': { background: '#f0f1fa' }
                }}>
                  
                  <td style={{ padding: 10 }}>{eq.name || '-'}</td>
                  <td style={{ padding: 10 }}>{eq.manufacturer || '-'}</td>
                  <td style={{ padding: 10 }}>{eq.model || '-'}</td>
                  <td style={{ padding: 10 }}>{eq.serial || '-'}</td>
                  <td style={{ padding: 10 }}>{eq.location || '-'}</td>
                  <td style={{ padding: 10 }}>{eq.department || '-'}</td>
                  <td style={{ padding: 10 }}>{eq.status || '-'}</td>
                  <td style={{ padding: 10 }}>{eq.operator || '-'}</td>
                  <td style={{ padding: 10 }}>{eq.lifespan || '-'}</td>
                  <td style={{ padding: 10 }}>{eq.power || '-'}</td>
                  <td style={{ padding: 10 }}>{eq.purchaseDate ? eq.purchaseDate.toString().slice(0, 10) : '-'}</td>
                  <td style={{ padding: 10 }}>{eq.warrantyExpiry ? eq.warrantyExpiry.toString().slice(0, 10) : '-'}</td>
                  <td style={{ padding: 10 }}>{eq.maintenanceInterval || '-'}</td>
                  <td style={{ padding: 10 }}>{eq.lastMaintenanceDate ? eq.lastMaintenanceDate.toString().slice(0, 10) : '-'}</td>
                  <td style={{ padding: 10, minWidth: 120 }}>
                    <button
                      onClick={() => openEditModal(eq)}
                      style={{ background: '#f0f1fa', color: '#21243d', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 500, cursor: 'pointer', marginRight: 8, fontSize: 14, boxShadow: '0 1px 2px #0001' }}
                    >Edit</button>
                    <button
                      onClick={() => handleDelete(eq.id, eq.manufacturer || eq.name || '')}
                      disabled={deleteLoading === eq.id}
                      style={{ background: '#ffeded', color: '#d11a2a', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 500, cursor: deleteLoading === eq.id ? 'not-allowed' : 'pointer', fontSize: 14, boxShadow: '0 1px 2px #0001', opacity: deleteLoading === eq.id ? 0.6 : 1 }}
                    >{deleteLoading === eq.id ? 'Deleting...' : 'Delete'}</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}