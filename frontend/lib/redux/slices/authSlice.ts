// lib/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id?: number;
  email?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{
      user: User;
      token: string;
      isAuthenticated: boolean;
    }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      // Stockage dans les cookies pour le middleware
      if (typeof window !== 'undefined') {
        document.cookie = `token=${token}; path=/`;
        document.cookie = `role=${user.role}; path=/`;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Nettoyage des cookies
      if (typeof window !== 'undefined') {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;