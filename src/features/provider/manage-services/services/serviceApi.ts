import axiosInstance from '@/services/axios';
import { AxiosError } from 'axios';
import {
  Service,
  ServiceCategory,
  ApiResponse,
  ErrorResponse,
} from '../types/service.types';

export const fetchCategories = async (authToken: string | null) => {
  if (!authToken) throw new Error('Phiên đăng nhập hết hạn.');
  try {
    const response = await axiosInstance.get<ApiResponse<{ items: ServiceCategory[] }>>(
      '/api/ServiceCategory/get-all',
      {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { pageNumber: 1, pageSize: 100 },
      }
    );
    if (response.status !== 200 || response.data.statusCode !== 200) {
      throw new Error(response.data.message || 'Lỗi khi lấy danh sách danh mục');
    }
    return response.data.data.items || [];
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data?.message || 'Lỗi khi lấy danh sách danh mục dịch vụ');
  }
};

export const fetchServices = async (authToken: string | null, providerId: string) => {
  if (!authToken || !providerId) throw new Error('Không tìm thấy thông tin nhà cung cấp.');
  try {
    const response = await axiosInstance.get<ApiResponse<Service[]>>(
      `/api/Service/by-provider/${providerId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { pageNumber: 1, pageSize: 100 },
      }
    );
    console.log('Dữ liệu dịch vụ từ API:', response.data.data);
    if (response.status !== 200 || response.data.statusCode !== 200) {
      throw new Error(response.data.message || 'Lỗi khi lấy danh sách dịch vụ');
    }
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (err: any) {
    console.error('Lỗi khi lấy dịch vụ:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Lỗi khi lấy danh sách dịch vụ.');
  }
};

export const createService = async (
  authToken: string | null,
  payload: {
    categoryId: string;
    serviceName: string;
    description: string;
    price: number;
    duration: number;
    isAvailable: boolean;
    providerId: string;
  }
) => {
  if (!authToken) throw new Error('Phiên đăng nhập hết hạn.');
  try {
    const response = await axiosInstance.post<ApiResponse<any>>('/api/Service/create', payload, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Dịch vụ vừa tạo:', response.data);
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data.message || 'Lỗi khi tạo dịch vụ');
    }
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    console.error('Lỗi khi tạo dịch vụ:', axiosError.response?.data || err);
    throw new Error(axiosError.response?.data?.message || 'Lỗi khi tạo dịch vụ.');
  }
};

export const updateService = async (
  authToken: string | null,
  payload: {
    id: string;
    serviceName: string;
    description: string;
    price: number;
    duration: number;
    isAvailable: boolean;
    categoryId: string;
  }
) => {
  if (!authToken) throw new Error('Phiên đăng nhập hết hạn.');
  try {
    const response = await axiosInstance.put<ApiResponse<any>>('/api/Service/update', payload, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Lỗi khi cập nhật dịch vụ');
    }
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    console.error('Lỗi khi cập nhật dịch vụ:', axiosError.response?.data || err);
    throw new Error(axiosError.response?.data?.message || 'Lỗi khi cập nhật dịch vụ.');
  }
};

export const deleteService = async (authToken: string | null, id: string) => {
  if (!authToken) throw new Error('Phiên đăng nhập hết hạn.');
  try {
    const response = await axiosInstance.delete<ApiResponse<any>>(`/api/Service/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (response.status !== 200 || (response.data.statusCode && response.data.statusCode !== 200)) {
      throw new Error(response.data.message || 'Lỗi khi xóa dịch vụ');
    }
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data?.message || 'Lỗi khi xóa dịch vụ');
  }
};

export const getServiceById = async (id: string) => {
  const response = await axiosInstance.get(`/api/Service/${id}`)
  return response.data.data
}