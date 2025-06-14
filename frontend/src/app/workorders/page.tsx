'use client';
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface WorkOrder {
  id: number;
  description: string;
  status: string;
  priority: string;
  assignedTechnician?: { id: number; name: string } | null;
  equipment?: { id: number; name: string } | null;
  faultReportedBy?: { id: number; name: string } | null;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
  maintenanceType?: string;
  repairCost?: number;
  repairTime?: string;
  reason?: string;
  solution?: string;
}

interface EquipmentSummary {
  id: number;
  name: string;
}

interface UserSummary {
  id: number;
  name: string;
}

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [equipmentList, setEquipmentList] = useState<EquipmentSummary[]>([]);
  const [usersList, setUsersList] = useState<UserSummary[]>([]);
  const [form, setForm] = useState({
    description: '',
    status: '',
    priority: '',
    assignedTechnicianId: '',
    equipmentId: '',
    faultReportedById: '',
    maintenanceType: '',
    repairCost: '',
    repairTime: '',
    reason: '',
    solution: ''
  });

  const [editId, setEditId] = useState<number | null>(null);

  function openModal() {
    setEditId(null);
    setForm({ description: '', status: '', priority: '', assignedTechnicianId: '', equipmentId: '', faultReportedById: '', maintenanceType: '', repairCost: '', repairTime: '', reason: '', solution: '' });
    setShowModal(true);
    setSubmitError(null);
  }

  function openEditModal(wo: WorkOrder) {
    setEditId(wo.id);
    setForm({
      description: wo.description || '',
      status: wo.status || '',
      priority: wo.priority || '',
      assignedTechnicianId: wo.assignedTechnician?.id?.toString() || '',
      equipmentId: wo.equipment?.id?.toString() || '',
      faultReportedById: wo.faultReportedBy?.id?.toString() || '',
      maintenanceType: wo.maintenanceType || '',
      repairCost: wo.repairCost?.toString() || '',
      repairTime: wo.repairTime || '',
      reason: wo.reason || '',
      solution: wo.solution || ''
    });
    setShowModal(true);
    setSubmitError(null);
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Work order will be deleted!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/workorders/${id}`);
        fetchWorkOrders();
        Swal.fire({
          toast: true,
          position: 'bottom',
          icon: 'success',
          title: 'Work order deleted',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
      } catch (err: any) {
        let msg = 'Failed to delete work order';
        if (err.response && err.response.data && err.response.data.error) {
          msg = err.response.data.error;
        }
        Swal.fire('Failed', msg, 'error');
      }
    }
  }
  function closeModal() {
    setShowModal(false);
    setSubmitError(null);
  }
  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function fetchWorkOrders() {
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/workorders`)
      .then(res => {
        setWorkOrders(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load work orders");
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchWorkOrders();
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/equipment`).then(res => setEquipmentList(res.data));
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`).then(res => setUsersList(res.data));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      const payload: {
        description: string;
        status: string;
        priority: string;
        maintenanceType: string;
        repairCost?: number;
        repairTime: string;
        reason: string;
        solution: string;
        assignedTechnicianId?: number;
        equipmentId?: number;
        faultReportedById?: number;
      } = {
        description: form.description,
        status: form.status,
        priority: form.priority,
        maintenanceType: form.maintenanceType,
        repairCost: form.repairCost ? Number(form.repairCost) : undefined,
        repairTime: form.repairTime,
        reason: form.reason,
        solution: form.solution
      };
      if (form.assignedTechnicianId) payload.assignedTechnicianId = Number(form.assignedTechnicianId);
      if (form.equipmentId) payload.equipmentId = Number(form.equipmentId);
      if (form.faultReportedById) payload.faultReportedById = Number(form.faultReportedById);
      if (editId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/workorders/${editId}`, payload);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/workorders`, payload);
      }
      closeModal();
      setForm({ description: '', status: '', priority: '', assignedTechnicianId: '', equipmentId: '', faultReportedById: '', maintenanceType: '', repairCost: '', repairTime: '', reason: '', solution: '' });
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: editId ? 'Work order updated' : 'Work order created',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      fetchWorkOrders();
    } catch (err: unknown) {
      function isAxiosErrorWithMessage(error: unknown): error is { response: { data: { error: string } } } {
        return (
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as { response?: unknown }).response === 'object' &&
          (error as { response?: { data?: unknown } }).response !== null &&
          'data' in (error as { response: { data?: unknown } }).response &&
          typeof ((error as { response: { data?: unknown } }).response as { data?: unknown }).data === 'object' &&
          ((error as { response: { data: { error?: unknown } } }).response.data as { error?: unknown }).error !== undefined &&
          typeof ((error as { response: { data: { error?: unknown } } }).response.data as { error?: unknown }).error === 'string'
        );
      }

      if (isAxiosErrorWithMessage(err)) {
        setSubmitError(err.response.data.error);
        Swal.fire('Failed', err.response.data.error, 'error');
      } else if (err instanceof Error) {
        setSubmitError(err.message);
        Swal.fire('Failed', err.message, 'error');
      } else {
        setSubmitError('Failed to create work order');
        Swal.fire('Failed', 'Failed to create work order', 'error');
      }
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <div style={{ padding: '1.5rem 0', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
        <button
          onClick={openModal}
          style={{ background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', letterSpacing: 0.2 }}
        >+ Add New Work Order</button>
        <h2 style={{ margin: 0 }}>Work Orders</h2>
      </div>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0005', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 480, maxWidth: 600, boxShadow: '0 4px 32px #0002', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', fontSize: 24, color: '#999', cursor: 'pointer', fontWeight: 600 }}>&times;</button>
            <h3 style={{ margin: 0, marginBottom: 18 }}>Add New Work Order</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <input name="description" value={form.description} onChange={handleInput} placeholder="Description" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <select name="status" value={form.status} onChange={handleInput} required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }}>
                  <option value="">Select Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <input name="priority" value={form.priority} onChange={handleInput} placeholder="Priority" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <select name="assignedTechnicianId" value={form.assignedTechnicianId} onChange={handleInput} style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} required>
                  <option value="">Select Assigned Technician</option>
                  {usersList.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <select name="equipmentId" value={form.equipmentId} onChange={handleInput} style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} required>
                  <option value="">Select Equipment</option>
                  {equipmentList.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
                </select>
                <select name="faultReportedById" value={form.faultReportedById} onChange={handleInput} style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} required>
                  <option value="">Select Fault Reporter</option>
                  {usersList.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <input name="maintenanceType" value={form.maintenanceType} onChange={handleInput} placeholder="Maintenance Type (corrective/preventive)" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="repairCost" value={form.repairCost} onChange={handleInput} placeholder="Repair Cost" type="text" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="repairTime" value={form.repairTime} onChange={handleInput} placeholder="Repair Time (e.g. 2h 30m)" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="reason" value={form.reason} onChange={handleInput} placeholder="Reason" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                {/* Empty div to keep grid alignment */}
                <div />
                <textarea name="solution" value={form.solution} onChange={handleInput} placeholder="Solution" style={{ gridColumn: '1 / -1', padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15, minHeight: 60 }} />
                {submitError && <div style={{ color: 'red', paddingTop: 4, gridColumn: '1 / -1' }}>{submitError}</div>}
                <button type="submit" disabled={submitLoading} style={{ gridColumn: '1 / -1', background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 0', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: submitLoading ? 'not-allowed' : 'pointer', marginTop: 6 }}>
                  {submitLoading ? 'Saving...' : 'Save Work Order'}
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
          <table style={{ minWidth: 1400, width: '100%', borderCollapse: 'separate', borderSpacing: 0, borderRadius: 16, overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
                {["Description", "Status", "Priority", "Technician", "Equipment", "Reporter", "Created", "Updated", "Completed", "Type", "Repair Cost", "Repair Time", "Reason", "Solution", "Actions"].map((header, i) => (
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
                      borderTopRightRadius: i === 14 ? 16 : 0
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workOrders.length === 0 ? (
                <tr><td colSpan={15} style={{ textAlign: 'center', padding: 32, color: '#999', background: '#fafbfc' }}>No work orders found.</td></tr>
              ) : (
                workOrders.map((wo, idx) => (
                  <tr key={wo.id} style={{
                    borderBottom: '1px solid #eee',
                    background: idx % 2 === 0 ? '#fff' : '#f7f8fa',
                    transition: 'background 0.2s',
                  }}>
                    <td style={{ padding: 10 }}>{wo.description}</td>
                    <td style={{ padding: 10 }}>{wo.status}</td>
                    <td style={{ padding: 10 }}>{wo.priority}</td>
                    <td style={{ padding: 10 }}>{wo.assignedTechnician?.name || '-'}</td>
                    <td style={{ padding: 10 }}>{wo.equipment?.name || '-'}</td>
                    <td style={{ padding: 10 }}>{wo.faultReportedBy?.name || '-'}</td>
                    <td style={{ padding: 10 }}>{wo.createdAt ? wo.createdAt.slice(0, 10) : '-'}</td>
                    <td style={{ padding: 10 }}>{wo.updatedAt ? wo.updatedAt.slice(0, 10) : '-'}</td>
                    <td style={{ padding: 10 }}>{wo.completedAt ? wo.completedAt.slice(0, 10) : '-'}</td>
                    <td style={{ padding: 10 }}>{wo.maintenanceType || '-'}</td>
                    <td style={{ padding: 10 }}>{wo.repairCost ?? '-'}</td>
                    <td style={{ padding: 10 }}>{wo.repairTime || '-'}</td>
                    <td style={{ padding: 10 }}>{wo.reason || '-'}</td>
                    <td style={{ padding: 10 }}>{wo.solution || '-'}</td>
                    <td style={{ padding: 10 }}>
                      <button
                        style={{ marginRight: 8, padding: '4px 12px', background: '#f6c700', color: '#222', border: 'none', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}
                        onClick={() => openEditModal(wo)}
                      >Edit</button>
                      <button
                        style={{ padding: '4px 12px', background: '#e32d2d', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}
                        onClick={() => handleDelete(wo.id)}
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
