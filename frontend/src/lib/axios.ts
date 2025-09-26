import axios from 'axios';

const api = axios.create({
  baseURL: "https://weddpro.uz/uz/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Token interceptor qo'shish
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    } else {
      console.warn('Token topilmadi, so‘rov token holda yuborilmaydi');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data); // Debug
    return response;
  },
  (error) => {
    console.error('Axios error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      message: error.message,
    });
    if (error.response?.status === 401) {
      console.warn('401 detected, clearing token and redirecting to login');
      localStorage.removeItem("auth_token");
      setTimeout(() => window.location.href = '/login', 9000); // Kechiktirish
    }
    return Promise.reject(error);
  }
);

export default api;
