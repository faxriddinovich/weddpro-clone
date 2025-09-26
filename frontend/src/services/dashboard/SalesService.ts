// src/services/SalesService.ts
import api from '@/lib/axios';

interface OrderStatsItem {
  date: string;
  total_sales: number;
  order_count: number;
  category_breakdown: {
    name: string;
    value: number;
    color: string;
  }[];
}

interface OrderStats {
  daily: OrderStatsItem[];
  weekly: OrderStatsItem[];
  monthly: OrderStatsItem[];
  all: OrderStatsItem[];
}

export const getOrderStats = async (): Promise<OrderStats> => {
  try {
    const response = await api.get('/dashboard/order-stats/');
    if (!response.data || Object.values(response.data).every((arr:any[]) => arr.length === 0)) {
      console.warn('No data returned from /dashboard/order-stats/');
    }
    return response.data;
  } catch (error: any) {
    console.error('Error fetching order stats:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 401) {
      throw new Error('Autentifikatsiya xatosi – qayta login qiling');
    }
    throw new Error('Buyurtmalar statistikasini olishda xatolik yuz berdi');
  }
};