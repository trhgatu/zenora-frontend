import axiosInstance from '@/services/axios';
import { AxiosError } from 'axios';
import { Promotion, ApiResponse, ErrorResponse } from '../types/promotion.types';

export const fetchPromotions = async (providerId: string, token: string, filterTitle: string = ''): Promise<Promotion[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Promotion[]>>(
      `/api/Promotion/by-provider/${providerId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Lỗi khi lấy danh sách khuyến mãi');
    }
    let promotions = Array.isArray(response.data.data) ? response.data.data : [];
    if (filterTitle) {
      promotions = promotions.filter((promotion) =>
        promotion.title.toLowerCase().includes(filterTitle.toLowerCase())
      );
    }
    return promotions;
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data?.message || 'Lỗi khi lấy danh sách khuyến mãi');
  }
};

export const createPromotion = async (token: string, payload: {
  title: string;
  description: string;
  discountPercent: number;
  discountAmount: number;
  quantity: number;
  startDate: string;
  endDate: string;
  providerId: string;
}) => {
  try {
    const response = await axiosInstance.post<ApiResponse<any>>(
      '/api/Promotion/create',
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('API response:', response.data); // Log để kiểm tra phản hồi
    return response.data;
  } catch (err: any) {
    const axiosError = err as AxiosError<ErrorResponse>;
    let errorMessage = axiosError.response?.data?.message || 'Lỗi khi thêm khuyến mãi';
    if (axiosError.response?.status === 400 && axiosError.response?.data?.errors) {
      errorMessage = Object.values(axiosError.response.data.errors).flat().join(', ');
    } else if (axiosError.response?.status === 401) {
      errorMessage = 'Phiên đăng nhập không hợp lệ';
    }
    throw new Error(errorMessage);
  }
};

export const updatePromotion = async (token: string, payload: {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  discountAmount: number;
  quantity: number;
  startDate: string;
  endDate: string;
  providerId: string;
}) => {
  try {
    const response = await axiosInstance.put<ApiResponse<any>>(
      '/api/Promotion/update',
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Lỗi khi cập nhật khuyến mãi');
    }
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data?.message || 'Lỗi khi cập nhật khuyến mãi');
  }
};

export const deletePromotion = async (token: string, id: string) => {
  try {
    const response = await axiosInstance.delete<ApiResponse<any>>(
      `/api/Promotion/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Lỗi khi xóa khuyến mãi');
    }
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data?.message || 'Lỗi khi xóa khuyến mãi');
  }
};