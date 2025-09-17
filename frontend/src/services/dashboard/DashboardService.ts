// src/services/DashboardService.ts
import api from '@/lib/axios';

interface DashboardStats {
  total_sales: number;
  total_orders: number;
  total_customers: number;
  daily_sales: number;
  weekly_sales: number;
  monthly_sales: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get('/dashboard/stats/');
    console.log('Dashboard stats response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 401) {
      throw new Error('Autentifikatsiya xatosi – qayta login qiling');
    }
    throw new Error('Dashboard statistikasini olishda xatolik yuz berdi');
  }
};