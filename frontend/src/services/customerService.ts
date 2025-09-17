// src/services/customerService.ts
import api from '../lib/axios';

interface Customer {
  id: number;
  name: string;
  phone: string | null;
  order_count: number;
  registered_at: string;
  last_visit: string | null;
  platform: number;
}

interface FormData {
  name: string;
  phone: string | null;
  platform: number;
  // order_count and dates are managed by backend
}

const PLATFORM_MAP: { [key: number]: string } = {
  1: 'Telegram',
  2: 'Web',
  3: 'Mobile App',
  // Add more if known; otherwise, handle unknown
};

const mapFromBackend = (cust: any): Customer => ({
  id: cust.id,
  name: cust.name,
  phone: cust.phone,
  order_count: cust.order_count,
  registered_at: cust.registered_at,
  last_visit: cust.last_visit,
  platform: cust.platform,
});

const mapToBackend = (data: FormData) => ({
  name: data.name,
  phone: data.phone,
  platform: data.platform,
});

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await api.get('/customer/');
    return response.data.map(mapFromBackend);
  } catch (error: any) {
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 401) {
      throw new Error('Autentifikatsiya xatosi – qayta login qiling');
    }
    throw new Error('Mijozlar ro\'yxatini olishda xatolik yuz berdi');
  }
};

export const createCustomer = async (data: FormData): Promise<Customer> => {
  try {
    const payload = mapToBackend(data);
    const response = await api.post('/customer/', payload);
    return mapFromBackend(response.data);
  } catch (error) {
    throw new Error('Yangi mijoz qo\'shishda xatolik yuz berdi');
  }
};

export const updateCustomer = async (id: number, data: FormData): Promise<Customer> => {
  try {
    const payload = mapToBackend(data);
    const response = await api.put(`/customer/${id}/`, payload);
    return mapFromBackend(response.data);
  } catch (error) {
    throw new Error('Mijoz ma\'lumotlarini yangilashda xatolik yuz berdi');
  }
};

export const deleteCustomer = async (id: number): Promise<void> => {
  try {
    await api.delete(`/customer/${id}/`);
  } catch (error) {
    throw new Error('Mijozni o\'chirishda xatolik yuz berdi');
  }
};

export { PLATFORM_MAP };