'use client';

import { useEffect } from 'react';
import { initializeAuth } from '@/redux/authSlice';
import { useDispatch } from 'react-redux';

export default function ReinstateSession() {
    const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return null;
}