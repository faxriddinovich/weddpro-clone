// src/services/branchService.ts
import api from "@/lib/axios";

export interface Branch {
  id: number;
  nomi: string;
  manzil: string;
  telefon: string;
  masul_shaxs: string;
  sana: string;
  isActive?: boolean; // Frontend uchun qo‘shimcha
}

export const getBranches = async (): Promise<Branch[]> => {
  try {
    const response = await api.get("/filial/");
    console.log("Filiallar javobi:", response.data);
    return response.data.map((branch: any) => ({
      ...branch,
      isActive: branch.isActive || true, // Backenddan kelmasa, default true
    }));
  } catch (error: any) {
    console.error("Filiallarni olishda xatolik:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      error.response?.data?.detail || "Filiallarni olishda xatolik yuz berdi"
    );
  }
};

export const createBranch = async (branch: Omit<Branch, "id">): Promise<Branch> => {
  try {
    const response = await api.post("/filial/", branch);
    console.log("Yangi filial qo'shildi:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Filial qo'shishda xatolik:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      error.response?.data?.detail || "Filial qo'shishda xatolik yuz berdi"
    );
  }
};

export const updateBranch = async (id: number, branch: Partial<Branch>): Promise<Branch> => {
  try {
    const response = await api.put(`/filial/${id}/`, branch);
    console.log("Filial yangilandi:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Filialni yangilashda xatolik:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      error.response?.data?.detail || "Filialni yangilashda xatolik yuz berdi"
    );
  }
};

export const deleteBranch = async (id: number): Promise<void> => {
  try {
    await api.delete(`/filial/${id}/`);
    console.log("Filial o'chirildi:", id);
  } catch (error: any) {
    console.error("Filialni o'chirishda xatolik:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      error.response?.data?.detail || "Filialni o'chirishda xatolik yuz berdi"
    );
  }
};