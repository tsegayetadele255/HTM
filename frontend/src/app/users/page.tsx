"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface WorkOrderSummary {
  id: number;
  description: string;
  status: string;
  createdAt?: string;
}

interface User {
  id: number;
  username: string;
  fullName?: string;
  email?: string;
  phone?: string;
  department?: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
  assignedWorkOrders?: WorkOrderSummary[];
  reportedWorkOrders?: WorkOrderSummary[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    isActive: true
  });

  function fetchUsers() {
    setLoading(true);
    axios.get("http://localhost:4000/api/users")
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load users");
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function openAddModal() {
    setEditId(null);
    setForm({ username: '', password: '', fullName: '', email: '', phone: '', department: '', role: '', isActive: true });
    setShowModal(true);
    setSubmitError(null);
  }
  function openEditModal(u: User) {
    setEditId(u.id);
    setForm({
      username: u.username || '',
      password: '',
      fullName: u.fullName || '',
      email: u.email || '',
      phone: u.phone || '',
      department: u.department || '',
      role: u.role || '',
      isActive: !!u.isActive
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
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === 'checkbox' && 'checked' in e.target) {
      fieldValue = (e.target as HTMLInputElement).checked;
    }
    setForm(f => ({ ...f, [name]: fieldValue }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      const payload: { username: string; fullName: string; email: string; phone: string; department: string; role: string; isActive: boolean; password?: string } = {
        username: form.username,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        department: form.department,
        role: form.role,
        isActive: form.isActive
      };
      if (form.password) payload.password = form.password;
      if (editId) {
        await axios.put(`http://localhost:4000/api/users/${editId}`, payload);
      } else {
        if (!form.password) throw new Error('Password is required');
        await axios.post("http://localhost:4000/api/users", payload);
      }
      closeModal();
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: editId ? 'User updated' : 'User created',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      fetchUsers();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data) {
        setSubmitError((err as { response: { data: { error: string } } }).response.data.error);
        Swal.fire('Failed', (err as { response: { data: { error: string } } }).response.data.error, 'error');
      } else if (err instanceof Error) {
        setSubmitError(err.message);
        Swal.fire('Failed', err.message, 'error');
      } else {
        setSubmitError('Failed to save user');
        Swal.fire('Failed', 'Failed to save user', 'error');
      }
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleDelete(id: number, username: string) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `User "${username}" will be deleted!`,
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
      await axios.delete(`http://localhost:4000/api/users/${id}`);
      Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        title: 'User deleted',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      fetchUsers();
    } catch {
      Swal.fire('Failed', 'Failed to delete user', 'error');
    }
  }

  // State for expanded rows
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  return (
    <div style={{ padding: '1.5rem 0', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
        <button
          onClick={openAddModal}
          style={{ background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', letterSpacing: 0.2 }}
        >+ Add New User</button>
        <h2 style={{ margin: 0 }}>Users</h2>
      </div>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0005', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 440, maxWidth: 540, boxShadow: '0 4px 32px #0002', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', fontSize: 24, color: '#999', cursor: 'pointer', fontWeight: 600 }}>&times;</button>
            <h3 style={{ margin: 0, marginBottom: 18 }}>{editId ? 'Edit User' : 'Add New User'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <input name="username" value={form.username} onChange={handleInput} placeholder="Username" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="fullName" value={form.fullName} onChange={handleInput} placeholder="Full Name" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="email" value={form.email} onChange={handleInput} placeholder="Email" type="email" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="phone" value={form.phone} onChange={handleInput} placeholder="Phone" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="department" value={form.department} onChange={handleInput} placeholder="Department" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="role" value={form.role} onChange={handleInput} placeholder="Role" required style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <input name="password" value={form.password} onChange={handleInput} placeholder="Password" type="password" style={{ padding: 10, borderRadius: 6, border: '1px solid #d6d8e7', fontSize: 15 }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: '#222', fontWeight: 500 }}>
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleInput} style={{ width: 18, height: 18 }} />
                  Active
                </label>
                {submitError && <div style={{ color: 'red', gridColumn: '1 / -1', paddingTop: 4 }}>{submitError}</div>}
                <button type="submit" disabled={submitLoading} style={{ gridColumn: '1 / -1', background: '#2d5be3', color: '#fff', border: 'none', padding: '10px 0', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: submitLoading ? 'not-allowed' : 'pointer', marginTop: 6 }}>
                  {submitLoading ? (editId ? 'Saving...' : 'Creating...') : (editId ? 'Save Changes' : 'Create User')}
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
          <table style={{ minWidth: 1100, width: '100%', borderCollapse: 'separate', borderSpacing: 0, borderRadius: 16, overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
                {["Username", "Full Name", "Email", "Phone", "Department", "Role", "Active", "Created", "Actions", "Work Orders"].map((header, i) => (
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
              {users.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: 32, color: '#999', background: '#fafbfc' }}>No users found.</td></tr>
              ) : (
                users.map((u, idx) => (
                  <React.Fragment key={u.id}>
                    <tr
                      style={{
                        borderBottom: '1px solid #eee',
                        background: idx % 2 === 0 ? '#fff' : '#f7f8fa',
                        transition: 'background 0.2s',
                      }}
                    >
                      <td style={{ padding: 10 }}>{u.username}</td>
                      <td style={{ padding: 10 }}>{u.fullName || '-'}</td>
                      <td style={{ padding: 10 }}>{u.email || '-'}</td>
                      <td style={{ padding: 10 }}>{u.phone || '-'}</td>
                      <td style={{ padding: 10 }}>{u.department || '-'}</td>
                      <td style={{ padding: 10 }}>{u.role}</td>
                      <td style={{ padding: 10 }}>{u.isActive ? 'Yes' : 'No'}</td>
                      <td style={{ padding: 10 }}>{u.createdAt ? u.createdAt.slice(0, 10) : '-'}</td>
                      <td style={{ padding: 10, minWidth: 120 }}>
                        <button
                          onClick={() => openEditModal(u)}
                          style={{ background: '#f0f1fa', color: '#21243d', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 500, cursor: 'pointer', marginRight: 8, fontSize: 14, boxShadow: '0 1px 2px #0001' }}
                        >Edit</button>
                        <button
                          onClick={() => handleDelete(u.id, u.username)}
                          style={{ background: '#ffeded', color: '#d11a2a', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 500, cursor: 'pointer', fontSize: 14, boxShadow: '0 1px 2px #0001' }}
                        >Delete</button>
                      </td>
                      <td style={{ padding: 10 }}>
                        <button
                          onClick={() => setExpandedUserId(expandedUserId === u.id ? null : u.id)}
                          style={{ background: '#e8f0fe', color: '#2d5be3', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 500, cursor: 'pointer', fontSize: 14 }}
                        >{expandedUserId === u.id ? 'Hide' : 'Show'} Work Orders</button>
                      </td>
                    </tr>
                    {expandedUserId === u.id && (
                      <tr>
                        <td colSpan={10} style={{ background: '#f9fbff', padding: 18 }}>
                          <div style={{ display: 'flex', gap: 40 }}>
                            <div style={{ flex: 1 }}>
                              <h4>Assigned Work Orders</h4>
                              {u.assignedWorkOrders && u.assignedWorkOrders.length > 0 ? (
                                <table style={{ width: '100%', marginBottom: 12 }}>
                                  <thead>
                                    <tr>
                                      <th style={{ textAlign: 'left', padding: 4 }}>ID</th>
                                      <th style={{ textAlign: 'left', padding: 4 }}>Description</th>
                                      <th style={{ textAlign: 'left', padding: 4 }}>Status</th>
                                      <th style={{ textAlign: 'left', padding: 4 }}>Created</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {u.assignedWorkOrders.map(wo => (
                                      <tr key={wo.id}>
                                        <td style={{ padding: 4 }}>{wo.id}</td>
                                        <td style={{ padding: 4 }}>{wo.description}</td>
                                        <td style={{ padding: 4 }}>{wo.status}</td>
                                        <td style={{ padding: 4 }}>{wo.createdAt ? wo.createdAt.slice(0, 10) : '-'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <div style={{ color: '#888', fontSize: 14 }}>None</div>
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <h4>Reported Work Orders</h4>
                              {u.reportedWorkOrders && u.reportedWorkOrders.length > 0 ? (
                                <table style={{ width: '100%' }}>
                                  <thead>
                                    <tr>
                                      <th style={{ textAlign: 'left', padding: 4 }}>ID</th>
                                      <th style={{ textAlign: 'left', padding: 4 }}>Description</th>
                                      <th style={{ textAlign: 'left', padding: 4 }}>Status</th>
                                      <th style={{ textAlign: 'left', padding: 4 }}>Created</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {u.reportedWorkOrders.map(wo => (
                                      <tr key={wo.id}>
                                        <td style={{ padding: 4 }}>{wo.id}</td>
                                        <td style={{ padding: 4 }}>{wo.description}</td>
                                        <td style={{ padding: 4 }}>{wo.status}</td>
                                        <td style={{ padding: 4 }}>{wo.createdAt ? wo.createdAt.slice(0, 10) : '-'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <div style={{ color: '#888', fontSize: 14 }}>None</div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

