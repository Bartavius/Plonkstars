import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean | null;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout(state) {
      Cookies.remove('authToken');
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    initializeAuth: (state) => {
      const token = Cookies.get('authToken');
      state.isAuthenticated = token ? true : false;
      state.token = token ?? null;
      }
  },
});

export const { loginSuccess, loginFailure, logout, initializeAuth } = authSlice.actions;

export default authSlice.reducer;