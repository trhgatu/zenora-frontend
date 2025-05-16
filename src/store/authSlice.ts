// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axios';
import { jwtDecode } from 'jwt-decode';
import { AxiosError } from 'axios';

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface JwtPayload {
  ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]: string;
  ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]: string;
  ["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]: string;
}

interface ErrorResponse {
  message: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  isInitialized: false,
};

const extractUserFromToken = (token: string): User => {
  const decoded = jwtDecode<JwtPayload>(token);
  const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
  return {
    _id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
    email,
    name: email.split('@')[0],
    role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
  };
};

export const restoreAuth = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>('auth/restoreAuth', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const user = extractUserFromToken(token);
    return { user, token };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(axiosError.response?.data?.message || 'Failed to restore auth');
  }
});

export const login = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/Auth/sign-in', { email, password });
    const token = response.data.data.accessToken;
    const user = extractUserFromToken(token);

    localStorage.setItem('token', token);
    return { user, token };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(axiosError.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk<
  AuthResponse,
  { name: string; email: string; password: string },
  { rejectValue: string }
>('auth/register', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/auth/register', { name, email, password });
    return response.data as AuthResponse;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(axiosError.response?.data?.message || 'Registration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isInitialized = true;
      })
      .addCase(restoreAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isInitialized = true;
        localStorage.removeItem('token');
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
