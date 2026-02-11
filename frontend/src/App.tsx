import { useEffect, useState } from 'react';
import './App.css';
<<<<<<< HEAD
import { AvatarUploader } from './AvatarUploader';
import { TrashIcon } from './TrashIcon';
import {
  employeeService,
  EmployeeStatus,
} from './services/api';
import type { Employee, EmployeeStatusType } from './services/api';

const STATUS_OPTIONS = Object.values(EmployeeStatus);

const STATUS_DISPLAY: Record<EmployeeStatusType, string> = {
  [EmployeeStatus.WORKING]: 'Working',
  [EmployeeStatus.ON_VACATION]: 'On Vacation',
  [EmployeeStatus.LUNCH_TIME]: 'Lunch Time',
  [EmployeeStatus.BUSINESS_TRIP]: 'Business Trip',
};

=======

type EmployeeStatus = 'Working' | 'OnVacation' | 'LunchTime' | 'BusinessTrip';

interface Employee {
  id: number;
  name: string;
  title?: string;
  status: EmployeeStatus;
  avatarUrl?: string;
}

const STATUS_OPTIONS: EmployeeStatus[] = [
  'Working',
  'OnVacation',
  'LunchTime',
  'BusinessTrip',
];

const STATUS_DISPLAY: Record<EmployeeStatus, string> = {
  Working: 'Working',
  OnVacation: 'On Vacation',
  LunchTime: 'Lunch Time',
  BusinessTrip: 'Business Trip',
};

const STATUS_COLORS: Record<EmployeeStatus, string> = {
  Working: '#22c55e',
  OnVacation: '#f97316',
  LunchTime: '#3b82f6',
  BusinessTrip: '#a855f7',
};

const API_BASE = 'http://localhost:3000';

>>>>>>> 87a00579f4f49fb29bbe4ac156f535c8b1772165
// Generate avatar placeholder based on name
const getAvatarUrl = (name: string, avatarUrl?: string): string => {
  if (avatarUrl) {
    const cleanUrl = avatarUrl.split('?')[0];
    if (cleanUrl.startsWith('/')) {
<<<<<<< HEAD
      return `${employeeService.getProfilePictureUrl(cleanUrl.replace('/uploads/', ''))}?t=${Date.now()}`;
=======
      return `${API_BASE}${cleanUrl}?t=${Date.now()}`;
>>>>>>> 87a00579f4f49fb29bbe4ac156f535c8b1772165
    }
    return `${cleanUrl}?t=${Date.now()}`;
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials,
  )}&background=random&size=128`;
};

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
<<<<<<< HEAD
  const [newStatus, setNewStatus] = useState<EmployeeStatusType>(
    EmployeeStatus.WORKING,
  );
=======
  const [newStatus, setNewStatus] = useState<EmployeeStatus>('Working');
>>>>>>> 87a00579f4f49fb29bbe4ac156f535c8b1772165

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
<<<<<<< HEAD
      const data = await employeeService.getAll();
=======
      const res = await fetch(`${API_BASE}/employees`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = (await res.json()) as Employee[];
>>>>>>> 87a00579f4f49fb29bbe4ac156f535c8b1772165
      setEmployees(data);
    } catch (e) {
      setError('Failed to load employees. Make sure the backend is running.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
<<<<<<< HEAD
      await employeeService.create({
        name: newName.trim(),
        status: newStatus,
      });

      setNewName('');
      setNewStatus(EmployeeStatus.WORKING);
=======
      const res = await fetch(`${API_BASE}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          status: newStatus,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to create employee');
      }

      setNewName('');
      setNewStatus('Working');
>>>>>>> 87a00579f4f49fb29bbe4ac156f535c8b1772165
      setIsModalOpen(false);
      await fetchEmployees();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create employee. Check backend connection.',
      );
      console.error(err);
    }
  };

<<<<<<< HEAD
  const handleStatusChange = async (
    id: number,
    status: EmployeeStatusType,
  ) => {
    try {
      await employeeService.updateStatus(id, status);
=======
  const handleStatusChange = async (id: number, status: EmployeeStatus) => {
    try {
      const res = await fetch(`${API_BASE}/employees/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
>>>>>>> 87a00579f4f49fb29bbe4ac156f535c8b1772165

      setEmployees((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e)),
      );
    } catch {
      setError('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
<<<<<<< HEAD
      await employeeService.delete(id);
=======
      const res = await fetch(`${API_BASE}/employees/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();

>>>>>>> 87a00579f4f49fb29bbe4ac156f535c8b1772165
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setError('Failed to delete employee');
    }
  };

  const handleAvatarUpload = async (id: number, file: File): Promise<void> => {
    try {
      setError(null);
<<<<<<< HEAD
      const updated = await employeeService.uploadProfilePicture(id, file);
=======

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/employees/${id}/avatar`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to upload avatar');
      }

      const updated = await res.json();
>>>>>>> 87a00579f4f49fb29bbe4ac156f535c8b1772165

      setEmployees((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, avatarUrl: updated.avatarUrl } : e,
        ),
      );
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Failed to upload avatar. Make sure the file is an image and under 5MB.';
      setError(errorMsg);
      console.error('Avatar upload error:', err);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Employee Status Management</h1>
        <p>Manage employee statuses in real time.</p>
      </header>

      <main className="app-main">
        <div className="top-bar">
          <button className="create-btn" onClick={() => setIsModalOpen(true)}>
            <span className="plus-icon">+</span>
            Create
          </button>
        </div>

        {error && (
          <div className="error-banner">
            {error}
            <button className="close-error" onClick={() => setError(null)}>
              ×
            </button>
          </div>
        )}

        {loading && employees.length === 0 ? (
          <div className="loading">Loading employees...</div>
        ) : (
          <div className="employee-grid">
            {employees.map((emp) => {
              const avatarSrc = getAvatarUrl(emp.name, emp.avatarUrl);

              return (
                <div key={emp.id} className="employee-card">
<<<<<<< HEAD
                  {/* Card actions */}
                  <div className="card-actions">
                    <AvatarUploader
                      onUpload={(file) => handleAvatarUpload(emp.id, file)}
                    />

                    <TrashIcon onClick={() => handleDelete(emp.id)} />
                  </div>
=======
                  {/* ✅ Actions (edit avatar + delete) in top-right */}
                  <div className="card-actions">
  <label className="edit-avatar-btn" title="Change photo">
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z"
        fill="currentColor"
      />
      <path
        d="M20.71 7.04a1 1 0 0 0 0-1.41L18.37 3.29a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"
        fill="currentColor"
      />
    </svg>

    <input
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          handleAvatarUpload(emp.id, file);
          e.target.value = '';
        }
      }}
    />
  </label>

  <button
    className="delete-btn"
    onClick={() => handleDelete(emp.id)}
    title="Delete employee"
  >
    ×
  </button>
</div>
>>>>>>> 87a00579f4f49fb29bbe4ac156f535c8b1772165



                  <div className="employee-avatar">
                    <img
                      key={`avatar-${emp.id}-${emp.avatarUrl || 'no-avatar'}`}
                      src={avatarSrc}
                      alt={emp.name}
<<<<<<< HEAD
                      className="employee-avatar-img"
=======
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
>>>>>>> 87a00579f4f49fb29bbe4ac156f535c8b1772165
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getAvatarUrl(emp.name);
                      }}
                    />
                  </div>

                  <div className="employee-info">
                    <h3>{emp.name}</h3>
                    {emp.title && (
                      <p className="employee-title">{emp.title}</p>
                    )}
                  </div>

                  <div className="employee-status">
                    <div
<<<<<<< HEAD
                      className={`status-indicator ${emp.status}`}
=======
                      className="status-indicator"
                      style={{ backgroundColor: STATUS_COLORS[emp.status] }}
>>>>>>> 87a00579f4f49fb29bbe4ac156f535c8b1772165
                    ></div>

                    <select
                      className="status-select"
                      value={emp.status}
                      onChange={(e) =>
                        handleStatusChange(
                          emp.id,
<<<<<<< HEAD
                          e.target.value as EmployeeStatusType,
=======
                          e.target.value as EmployeeStatus,
>>>>>>> 87a00579f4f49fb29bbe4ac156f535c8b1772165
                        )
                      }
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_DISPLAY[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}

            {!loading && employees.length === 0 && (
              <div className="empty-state">
                <p>No employees yet. Click "Create" to add one.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New User</h2>

            <form onSubmit={handleCreate}>
              <div className="form-field">
                <label>User name:</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Lora Ben Ishai"
                  required
                  autoFocus
                />
              </div>

              <div className="form-field">
                <label>Status:</label>
                <select
                  value={newStatus}
                  onChange={(e) =>
<<<<<<< HEAD
                    setNewStatus(e.target.value as EmployeeStatusType)
=======
                    setNewStatus(e.target.value as EmployeeStatus)
>>>>>>> 87a00579f4f49fb29bbe4ac156f535c8b1772165
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_DISPLAY[s]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-create">
                  Create
                </button>

                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
