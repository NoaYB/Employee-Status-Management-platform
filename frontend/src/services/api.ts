import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Employee Status as const object
export const EmployeeStatus = {
  WORKING: 'Working',
  ON_VACATION: 'OnVacation',
  LUNCH_TIME: 'LunchTime',
  BUSINESS_TRIP: 'BusinessTrip',
} as const;

export type EmployeeStatusType = typeof EmployeeStatus[keyof typeof EmployeeStatus];

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
  status: EmployeeStatusType;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
  status?: EmployeeStatusType;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const employeeService = {
  // Get all employees
  getAll: async (): Promise<Employee[]> => {
    const response = await api.get('/employees');
    return response.data;
  },

  // Get single employee
  getOne: async (id: string): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Create new employee
  create: async (data: CreateEmployeeDto): Promise<Employee> => {
    const response = await api.post('/employees', data);
    return response.data;
  },

  // Update employee status
  updateStatus: async (id: string, status: EmployeeStatusType): Promise<Employee> => {
    const response = await api.patch(`/employees/${id}/status`, { status });
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (id: string, file: File): Promise<Employee> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/employees/${id}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete employee
  delete: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  // Get profile picture URL
  getProfilePictureUrl: (filename: string): string => {
    return `${API_BASE_URL}/uploads/${filename}`;
  },
};