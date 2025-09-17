// src/services/productService.ts
import api from "@/lib/axios";

export interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
  price: number;   // ✅ number qildim
  status: string;
  description?: string;
  user?: number;
}

// Barcha mahsulotlarni olish
export const getProducts = async (): Promise<Product[]> => {
  try {
    const token = localStorage.getItem('auth_token');
    console.log('Token mavjudligi:', token ? 'Ha' : 'Yo\'q');
    const res = await api.get('/mahsulot/');
    console.log('API javobi:', res.data);

    if (Array.isArray(res.data)) {
      return res.data;
    }
    if (res.data.results) {
      return res.data.results;
    }
    return [];
  } catch (error: any) {
    console.error('Mahsulotlarni olishda xatolik:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      error.response?.status === 401
        ? 'Tizimga kiring yoki ro\'yxatdan o\'ting'
        : error.response?.data?.detail ||
          'Mahsulotlarni olishda xatolik yuz berdi'
    );
  }
};

// Yangi mahsulot qo‘shish
export const createProduct = async (product: Omit<Product, "id">): Promise<Product> => {
  try {
    const token = localStorage.getItem('auth_token');
    console.log('Yangi mahsulot qo‘shish uchun so‘rov:', product);
    const response = await api.post('/mahsulot/', {
      name: product.name,
      image: product.image, // Backend base64 yoki fayl URL'sini qabul qilishini tekshiring
      category: product.category,
      price: parseFloat(product.price), // Stringdan number ga o‘girish
      status: product.status,
      description: product.description,
    });
    console.log('Mahsulot qo‘shildi:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Mahsulot qo‘shishda xatolik:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      error.response?.data?.detail || 'Mahsulot qo‘shishda xatolik yuz berdi'
    );
  }
};

// Mahsulotni o‘chirish
export const deleteProduct = async (id: number) => {
  try {
    await api.delete(`/mahsulot/${id}/`);
    return true;
  } catch (error: any) {
    console.error('Mahsulotni o\'chirishda xatolik:', error);
    throw new Error('Mahsulotni o\'chirishda xatolik yuz berdi');
  }
};

// Mahsulot qo'shish
// export const createProduct = async (product: Omit<Product, "id">) => {
//   const res = await api.post("/mahsulot/", product);
//   return res.data;
// };

// Mahsulotni yangilash
// export const updateProduct = async (id: number, product: Partial<Product>) => {
//   const res = await api.put(`/products/${id}/`, product);
//   return res.data;
// };