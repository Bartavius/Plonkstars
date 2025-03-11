import axios from 'axios';
import Cookies from 'js-cookie';
import { logout } from '@/redux/authSlice';
import { log } from 'console';
import { useDispatch } from 'react-redux';
import { redirect } from 'next/navigation';


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND, // Replace with your backend URL
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.log(error);
  if(error.response?.status == 403 && error.response?.data?.error == "login required") {
      logout();
  }

  return Promise.reject(error);
});


api.interceptors.response.use(
  (response) => response, // Pass successful responses through
  (error) => {
    console.error("API Error:", error);

    // Check for 403 status
    console.log(error.response?.status)
    console.log(error.response?.data?.error);
    if (error.response?.status === 403 && error.response?.data?.error === "login required") {
      console.warn("403 Forbidden: Logging out user.");
      redirect("/account/logout");
    }

    return Promise.reject(error);
  }
);

export default api;