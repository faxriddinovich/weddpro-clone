// src/services/employeeService.ts
import api from '../lib/axios'; // Assuming the path is correct based on your structure

interface Employee {
  id: number;
  name: string;
  phone: string;
  role: string; // Backend values: 'admin', 'manager', etc.
  department: string | null;
  startDate: string;
  password: string;
}

interface FormData {
  name: string;
  phone: string;
  role: string;
  department: string;
  password: string;
  confirmPassword: string;
}

const mapToBackend = (data: FormData & { startDate?: string }) => ({
  ism: data.name,
  telefon: data.phone,
  rol: data.role,
  filial: data.department || null,
  parol: data.password,
  parol2: data.confirmPassword,
  ...(data.startDate && { ish_boshlagan_sana: data.startDate }), // Only include if updating or necessary
});

const mapFromBackend = (emp: any): Employee => ({
  id: emp.id,
  name: emp.ism,
  phone: emp.telefon,
  role: emp.rol,
  department: emp.filial,
  startDate: emp.ish_boshlagan_sana,
  password: emp.parol || '', // Assume password is returned; if not, handle accordingly
});

export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await api.get('/hodim/');
    return response.data.map(mapFromBackend);
  } catch (error) {
    throw new Error('Hodimlar ro\'yxatini olishda xatolik yuz berdi');
  }
};

export const createEmployee = async (data: FormData): Promise<Employee> => {
  try {
    const payload = mapToBackend({
      ...data,
      startDate: new Date().toISOString().split('T')[0],
    });
    const response = await api.post('/hodim/', payload);
    return mapFromBackend(response.data);
  } catch (error) {
    throw new Error('Yangi hodim qo\'shishda xatolik yuz berdi');
  }
};

export const updateEmployee = async (id: number, data: FormData): Promise<Employee> => {
  try {
    const payload = mapToBackend(data);
    const response = await api.put(`/hodim/${id}/`, payload);
    return mapFromBackend(response.data);
  } catch (error) {
    throw new Error('Hodim ma\'lumotlarini yangilashda xatolik yuz berdi');
  }
};

export const deleteEmployee = async (id: number): Promise<void> => {
  try {
    await api.delete(`/hodim/${id}/`);
  } catch (error) {
    throw new Error('Hodimni o\'chirishda xatolik yuz berdi');
  }
};