// src/services/orderService.ts
import api from "../lib/axios";

export interface Order {
  id: number;
  mijoz: string; // Backendda string sifatida keladi, lekin ID uchun alohida endpoint ishlatilishi mumkin
  tolov: string;
  yetkazish: string;
  holat: string;
  platforma: string;
  narx: number;
  vaqt: string;
  harakat?: string;
  mahsulot: string; // Backendda string sifatida keladi
}

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get("/buyurtma/");
    return response.data.map((order: any) => ({
      id: order.id,
      mijoz: order.mijoz,
      tolov: order.tolov,
      yetkazish: order.yetkazish,
      holat: order.holat === "tasdiqlangan" ? "Jarayonda" : order.holat,
      platforma: order.platforma,
      narx: parseFloat(order.narx),
      vaqt: new Date(order.vaqt).toLocaleString("uz-UZ", { dateStyle: "medium", timeStyle: "short" }),
      harakat: order.harakat,
      mahsulot: order.mahsulot,
    }));
  } catch (error: any) {
    console.error("Buyurtmalarni olishda xatolik:", error);
    throw new Error(
      error.response?.data?.detail || "Buyurtmalarni olishda xatolik yuz berdi"
    );
  }
};

export const getOrderById = async (id: number): Promise<Order> => {
  try {
    const response = await api.get(`/buyurtma/${id}/`);
    const order = response.data;
    return {
      id: order.id,
      mijoz: order.mijoz,
      tolov: order.tolov,
      yetkazish: order.yetkazish,
      holat: order.holat === "tasdiqlangan" ? "Jarayonda" : order.holat,
      platforma: order.platforma,
      narx: parseFloat(order.narx),
      vaqt: new Date(order.vaqt).toLocaleString("uz-UZ", { dateStyle: "medium", timeStyle: "short" }),
      harakat: order.harakat,
      mahsulot: order.mahsulot,
    };
  } catch (error: any) {
    console.error(`Buyurtma ${id} ni olishda xatolik:`, error);
    throw new Error(
      error.response?.data?.detail || `Buyurtma ${id} ni olishda xatolik yuz berdi`
    );
  }
};

export const createOrder = async (orderData: Omit<Order, "id">): Promise<Order> => {
  try {
    const response = await api.post("/buyurtma/", orderData);
    return response.data;
  } catch (error: any) {
    console.error("Buyurtma yaratishda xatolik:", error);
    throw new Error(
      error.response?.data?.detail || "Buyurtma yaratishda xatolik yuz berdi"
    );
  }
};

export const updateOrder = async (id: number, orderData: Partial<Order>): Promise<Order> => {
  try {
    const response = await api.put(`/buyurtma/${id}/`, orderData);
    return response.data;
  } catch (error: any) {
    console.error(`Buyurtma ${id} ni yangilashda xatolik:`, error);
    throw new Error(
      error.response?.data?.detail || `Buyurtma ${id} ni yangilashda xatolik yuz berdi`
    );
  }
};

export const deleteOrder = async (id: number): Promise<void> => {
  try {
    await api.delete(`/buyurtma/${id}/`);
  } catch (error: any) {
    console.error(`Buyurtma ${id} ni o'chirishda xatolik:`, error);
    throw new Error(
      error.response?.data?.detail || `Buyurtma ${id} ni o'chirishda xatolik yuz berdi`
    );
  }
};

// Enrichment funksiyalarini o‘chirish (agar alohida endpointlar mavjud bo‘lmasa)
export const getCustomerName = async (customerId: string): Promise<string> => {
  try {
    const response = await api.get(`/mijoz/${customerId}/`); // Backendda tasdiqlang
    return response.data.name || `Mijoz ${customerId}`;
  } catch (error: any) {
    console.error(`Mijoz ${customerId} nomini olishda xatolik:`, error);
    return `Mijoz ${customerId}`;
  }
};

export const getProductName = async (productId: string): Promise<string> => {
  try {
    const response = await api.get(`/mahsulot/${productId}/`); // Backendda tasdiqlang
    return response.data.name || `Mahsulot ${productId}`;
  } catch (error: any) {
    console.error(`Mahsulot ${productId} nomini olishda xatolik:`, error);
    return `Mahsulot ${productId}`;
  }
};

export const getPlatformName = async (platformId: string): Promise<string> => {
  try {
    const response = await api.get(`/platforma/${platformId}/`); // Backendda tasdiqlang
    return response.data.name || `Platforma ${platformId}`;
  } catch (error: any) {
    console.error(`Platforma ${platformId} nomini olishda xatolik:`, error);
    return `Platforma ${platformId}`;
  }
};