import { useEffect, useState } from 'react';
import './App.css';
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

// Generate avatar placeholder based on name
const getAvatarUrl = (name: string, avatarUrl?: string): string => {
  if (avatarUrl) {
    const cleanUrl = avatarUrl.split('?')[0];
    if (cleanUrl.startsWith('/')) {
      return `${employeeService.getProfilePictureUrl(cleanUrl.replace('/uploads/', ''))}?t=${Date.now()}`;
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
  const [newStatus, setNewStatus] = useState<EmployeeStatusType>(
    EmployeeStatus.WORKING,
  );

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getAll();
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
      await employeeService.create({
        name: newName.trim(),
        status: newStatus,
      });

      setNewName('');
      setNewStatus(EmployeeStatus.WORKING);
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

  const handleStatusChange = async (
    id: number,
    status: EmployeeStatusType,
  ) => {
    try {
      await employeeService.updateStatus(id, status);

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
      await employeeService.delete(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setError('Failed to delete employee');
    }
  };

  const handleAvatarUpload = async (id: number, file: File): Promise<void> => {
    try {
      setError(null);
      const updated = await employeeService.uploadProfilePicture(id, file);

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
                  {/* Card actions */}
                  <div className="card-actions">
                    <AvatarUploader
                      onUpload={(file) => handleAvatarUpload(emp.id, file)}
                    />

                    <TrashIcon onClick={() => handleDelete(emp.id)} />
                  </div>



                  <div className="employee-avatar">
                    <img
                      key={`avatar-${emp.id}-${emp.avatarUrl || 'no-avatar'}`}
                      src={avatarSrc}
                      alt={emp.name}
                      className="employee-avatar-img"
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
                      className={`status-indicator ${emp.status}`}
                    ></div>

                    <select
                      className="status-select"
                      value={emp.status}
                      onChange={(e) =>
                        handleStatusChange(
                          emp.id,
                          e.target.value as EmployeeStatusType,
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
                    setNewStatus(e.target.value as EmployeeStatusType)
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
