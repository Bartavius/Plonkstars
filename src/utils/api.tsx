import axios from 'axios';
import Cookies from 'js-cookie';
import { logout } from '@/redux/authSlice';
import { redirect } from 'next/navigation';
import { setBlockedURL, setError } from '@/redux/errorSlice';
import { store } from '@/redux/store';


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND, 
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  (error);
  return Promise.reject(error);
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for 403 status
    if (error.response?.status === 403 && error.response?.data?.error === "login required") {
      const attemptedUrl = window.location.pathname;
      if(store.getState().auth.isAuthenticated) {
        store.dispatch(setError("Session expired."));
      }
      else{
        store.dispatch(setError("Login required."));
      }
      store.dispatch(setBlockedURL(attemptedUrl)); 
      store.dispatch(logout());
      redirect("/account/login");
    }

    return Promise.reject(error);
  }
);

export default api;