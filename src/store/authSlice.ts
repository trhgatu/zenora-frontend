import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axios';
import { jwtDecode } from 'jwt-decode';
import axios, { AxiosError } from 'axios';

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
  exp?: number;
}

interface ErrorResponse {
  data?: any;
  additionalData?: any;
  message?: string;
  statusCode?: number;
  code?: string;
  detail?: string;
  errors?: any;
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

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp ? decoded.exp < currentTime : false;
  } catch {
    return true;
  }
};

export const restoreAuth = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>('auth/restoreAuth', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return rejectWithValue('');
    }

    if (isTokenExpired(token)) {
      throw new Error('Token đã hết hạn');
    }

    const user = extractUserFromToken(token);
    if (user.role !== 'Provider') {
      throw new Error('Tài khoản này không phải là Provider');
    }

    return { user, token };
  } catch (error) {
    localStorage.removeItem('accessToken');
    return rejectWithValue((error instanceof Error ? error.message : 'Không thể khôi phục trạng thái đăng nhập'));
  }
});

export const login = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    console.log('Sending login request:', { email, password });
    const response = await axiosInstance.post('/api/Auth/sign-in', { email, password });
    console.log('Login response:', response.data);

    if (!response.data.statusCode || response.data.statusCode !== 200) {
      let errorMessage = 'Đăng nhập thất bại';
      if (typeof response.data === 'string') {
        errorMessage = response.data;
      } else if (response.data.message) {
        errorMessage = response.data.message;
      } else if (response.data.detail) {
        errorMessage = response.data.detail;
      } else if (response.data.errors) {
        errorMessage = typeof response.data.errors === 'string' 
          ? response.data.errors 
          : JSON.stringify(response.data.errors);
      }
      throw new Error(errorMessage);
    }

    const token = response.data.data?.accessToken;
    if (!token) {
      throw new Error('Không nhận được token từ server');
    }

    const user = extractUserFromToken(token);
    if (user.role !== 'Provider') {
      throw new Error('Tài khoản này không phải là Provider');
    }

    localStorage.setItem('accessToken', token);
    return { user, token };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error('Login error:', axiosError.response?.data);
      console.error('Full error object:', axiosError);

      let errorMessage = 'Đăng nhập thất bại';
      if (axiosError.response?.data) {
        if (typeof axiosError.response.data === 'string') {
          errorMessage = axiosError.response.data;
        } else if (axiosError.response.data.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response.data.detail) {
          errorMessage = axiosError.response.data.detail;
        } else if (axiosError.response.data.errors) {
          errorMessage = typeof axiosError.response.data.errors === 'string' 
            ? axiosError.response.data.errors 
            : JSON.stringify(axiosError.response.data.errors);
        } else if (axiosError.response.statusText) {
          errorMessage = axiosError.response.statusText;
        } else {
          errorMessage = 'Lỗi không xác định từ server';
        }
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      } else {
        errorMessage = 'Lỗi không xác định';
      }

      if (axiosError.response?.status === 500) {
        return rejectWithValue('Có lỗi xảy ra trên server. Vui lòng thử lại sau hoặc liên hệ quản trị viên.');
      }
      if (axiosError.response?.status === 403) {
        return rejectWithValue('Trang API hiện đang bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.');
      }
      if (axiosError.response?.status === 401 || axiosError.response?.status === 400) {
        return rejectWithValue(errorMessage);
      }
      if (axiosError.code === 'ERR_NETWORK') {
        return rejectWithValue('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.');
      }
      return rejectWithValue(errorMessage);
    } else {
      return rejectWithValue(error instanceof Error ? error.message : 'Lỗi không xác định');
    }
  }
});

export const register = createAsyncThunk<
  AuthResponse,
  { name: string; email: string; password: string },
  { rejectValue: string }
>('auth/register', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    console.log('Sending register request:', { name, email, password });
    const response = await axiosInstance.post('/api/Auth/register', { name, email, password });
    console.log('Register response:', response.data);

    if (!response.data.statusCode || response.data.statusCode !== 200) {
      let errorMessage = 'Đăng ký thất bại';
      if (typeof response.data === 'string') {
        errorMessage = response.data;
      } else if (response.data.message) {
        errorMessage = response.data.message;
      } else if (response.data.detail) {
        errorMessage = response.data.detail;
      } else if (response.data.errors) {
        errorMessage = typeof response.data.errors === 'string' 
          ? response.data.errors 
          : JSON.stringify(response.data.errors);
      }
      throw new Error(errorMessage);
    }
    const token = response.data.data?.accessToken;
    if (!token) {
      throw new Error('Không nhận được token từ server');
    }
    const user = extractUserFromToken(token);

    if (user.role !== 'Provider') {
      throw new Error('Tài khoản này không phải là Provider');
    }

    localStorage.setItem('accessToken', token);
    return { user, token };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error('Register error:', axiosError.response?.data);
      console.error('Full error object:', axiosError);

      let errorMessage = 'Đăng ký thất bại';
      if (axiosError.response?.data) {
        if (typeof axiosError.response.data === 'string') {
          errorMessage = axiosError.response.data;
        } else if (axiosError.response.data.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response.data.detail) {
          errorMessage = axiosError.response.data.detail;
        } else if (axiosError.response.data.errors) {
          errorMessage = typeof axiosError.response.data.errors === 'string' 
            ? axiosError.response.data.errors 
            : JSON.stringify(axiosError.response.data.errors);
        } else if (axiosError.response.statusText) {
          errorMessage = axiosError.response.statusText;
        } else {
          errorMessage = 'Lỗi không xác định từ server';
        }
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      } else {
        errorMessage = 'Lỗi không xác định';
      }

      if (axiosError.response?.status === 500) {
        return rejectWithValue('Có lỗi xảy ra trên server. Vui lòng thử lại sau hoặc liên hệ quản trị viên.');
      }
      if (axiosError.response?.status === 403) {
        return rejectWithValue('Trang API hiện đang bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.');
      }
      if (axiosError.response?.status === 400) {
        return rejectWithValue(errorMessage);
      }
      if (axiosError.code === 'ERR_NETWORK') {
        return rejectWithValue('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.');
      }
      return rejectWithValue(errorMessage);
    } else {
      return rejectWithValue(error instanceof Error ? error.message : 'Lỗi không xác định');
    }
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
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken'); 
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
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
      .addCase(restoreAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isInitialized = true;
        state.error = action.payload || null;
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
        state.error = action.payload || 'Đăng nhập thất bại';
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
        state.error = action.payload || 'Đăng ký thất bại';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;