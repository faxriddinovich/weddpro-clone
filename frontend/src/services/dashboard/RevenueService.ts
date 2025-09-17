// src/services/RevenueService.ts
import api from '@/lib/axios';

interface DailyRevenueItem {
  day: number;
  total: number;
}

interface MonthlyRevenue {
  month: string;
  daily_revenue: DailyRevenueItem[];
}

export const getMonthlyRevenue = async (): Promise<MonthlyRevenue> => {
  try {
    const response = await api.get('/revenue/monthly/');
    console.log('Monthly revenue response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching monthly revenue:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 401) {
      throw new Error('Autentifikatsiya xatosi – qayta login qiling');
    }
    throw new Error('Oylik daromadni olishda xatolik yuz berdi');
  }
};