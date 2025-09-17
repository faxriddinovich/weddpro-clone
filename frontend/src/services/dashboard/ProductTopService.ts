// src/services/ProductService.ts
import api from '@/lib/axios';

interface MahsulotTop10Item {
  id: number;
  nom: string;
  sotildi: number;
  narx: number;
  holat: string;
  qolgan: number;
}

export const getTop10Products = async (): Promise<MahsulotTop10Item[]> => {
  try {
    const response = await api.get('/mahsulot/top10/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    console.log('Top 10 products response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching top 10 products:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 401) {
      throw new Error('Autentifikatsiya xatosi – qayta login qiling');
    }
    throw new Error('Top 10 mahsulotni olishda xatolik yuz berdi');
  }
};