// src/services/authService.ts
import api from "@/lib/axios";

export type RegisterRequest = {
  username: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  email?: string;
};

export type RegisterResponse = {
  message: string;
  telegram_link?: string;
  telegram_app_link?: string;
  token?: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  telegram_link?: string;
  token?: string;
};

export type VerifyRequest = {
  phone_number: string;
  code: string;
};

export type VerifyResponse = {
  token: string;
  message: string;
};

export type ResendResponse = {
  success: boolean;
  message?: string;
};

const normalizePhone = (raw: string) => {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  return digits.startsWith("998") ? `+${digits}` : `+998${digits.padStart(9, '0')}`;
};

export async function register(payload: RegisterRequest): Promise<RegisterResponse> {
  const body: RegisterRequest = {
    username: payload.username,
    phone_number: normalizePhone(payload.phone_number),
    password: payload.password,
    confirm_password: payload.confirm_password,
    ...(payload.email ? { email: payload.email } : {}),
  };
  console.log("Register body yuborilmoqda:", body);

  try {
    const response = await api.post<RegisterResponse>("/auth/register/", body, { withCredentials: true });
    console.log("Register javobi:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Registratsiya xatosi:", error.response?.data);
    const errorMessage = error.response?.data?.detail || 
      error.response?.data?.non_field_errors?.[0] ||
      (error.response?.data?.username ? "Bu username oldin ishlatilgan" : 
       error.response?.data?.phone_number ? "Bu telefon raqami allaqachon ro‘yxatdan o‘tgan" : 
       Object.values(error.response?.data || {})[0]?.[0] || 
       "Ro'yxatdan o'tishda xatolik yuz berdi");
    throw new Error(errorMessage);
  }
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const body: LoginRequest = {
    username: payload.username,
    password: payload.password,
  };

  try {
    const response = await api.post<LoginResponse>("/auth/login/", body, { withCredentials: true });
    console.log("Login javobi:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Login xatosi:", error.response?.data);
    const errorMessage = error.response?.data?.detail ||
      error.response?.data?.non_field_errors?.[0] ||
      "Login yoki parol noto‘g‘ri";
    throw new Error(errorMessage);
  }
}

export async function verifyRegister(payload: VerifyRequest): Promise<VerifyResponse> {
  console.log("Yuborilayotgan body:", payload);
  try {
    const response = await api.post<VerifyResponse>("/auth/verify_register/", payload, { withCredentials: true });
    console.log("Verify register javobi:", response.data);
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
      console.log("Verify token saqlandi:", response.data.token);
    }
    return response.data;
  } catch (error: any) {
    console.error("Verify register xatosi:", error.response?.data);
    const errorMessage = error.response?.data?.detail ||
      error.response?.data?.non_field_errors?.[0] ||
      "Tasdiqlashda xatolik yuz berdi";
    throw new Error(errorMessage);
  }
}

export async function verifyLogin(payload: VerifyRequest): Promise<VerifyResponse> {
  try {
    const response = await api.post<VerifyResponse>("/auth/verify_login/", payload, { withCredentials: true });
    console.log("Verify login javobi:", response.data);
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
    }
    return response.data;
  } catch (error: any) {
    console.error("Verify login xatosi:", error.response?.data);
    const errorMessage = error.response?.data?.detail ||
      error.response?.data?.non_field_errors?.[0] ||
      "Tasdiqlashda xatolik yuz berdi";
    throw new Error(errorMessage);
  }
}

export async function resendVerificationCode(phoneNumber: string, action: 'register' | 'login' = 'register'): Promise<ResendResponse> {
  try {
    const response = await api.post("/auth/resend_code/", { phone_number: normalizePhone(phoneNumber), action }, { withCredentials: true });
    return { success: true, message: response.data.message || "Yangi kod yuborildi" };
  } catch (error: any) {
    console.error("Resend xatosi:", error.response?.data);
    throw new Error(error.response?.data?.detail || "Kodni qayta yuborishda xatolik");
  }
}

export async function logout(): Promise<void> {
  try {
    const token = localStorage.getItem("auth_token");
    if (token) {
      await api.post("/auth/logout/", {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
    }
    localStorage.removeItem("auth_token");
    window.location.href = '/login';
  } catch (error: any) {
    console.error("Logout xatosi:", error.response?.data);
    localStorage.removeItem("auth_token");
    window.location.href = '/login';
  }
}

export function getToken() {
  return localStorage.getItem("auth_token");
}