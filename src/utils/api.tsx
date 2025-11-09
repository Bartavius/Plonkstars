import axios from 'axios';
import { redirect } from 'next/navigation';
import { setBlockedURL, setError } from '@/redux/errorSlice';
import { store } from '@/redux/store';
import { logout, isAuthenticated, getToken, isDemo } from '@/utils/auth';


const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND}/api`, 
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    if (token === 'demo') {
      config.headers.Authorization = 'demo';
    }
    else {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
      if(isAuthenticated()) {
        if(isDemo()){
          store.dispatch(setError("Login to access this feature"));
        }
        store.dispatch(setError("Session expired"));
      }
      else{
        store.dispatch(setError("Login required"));
      }
      store.dispatch(setBlockedURL(attemptedUrl)); 
      logout();
      redirect("/account/login");
    }

    return Promise.reject(error);
  }
);

export default api;