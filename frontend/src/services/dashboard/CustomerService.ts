// src/services/CustomerService.ts
import api from '@/lib/axios';

interface CustomerSourceItem {
  name: string;
  amount: number;
  shortName: string;
  color: string;
}

interface CustomerSource {
  daily: CustomerSourceItem[];
  weekly: CustomerSourceItem[];
  monthly: CustomerSourceItem[];
  all: CustomerSourceItem[];
}

export const getCustomerSource = async (): Promise<CustomerSource> => {
  try {
    const response = await api.get('/customers/source/');
    console.log('Customer source response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching customer source:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 401) {
      throw new Error('Autentifikatsiya xatosi – qayta login qiling');
    }
    throw new Error('Mijoz manbalarini olishda xatolik yuz berdi');
  }
};