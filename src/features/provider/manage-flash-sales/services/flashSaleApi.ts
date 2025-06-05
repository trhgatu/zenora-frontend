import axiosInstance from '@/services/axios';
import { AxiosError } from 'axios';
import { FlashSale, ApiResponse, PaginatedResponse, ErrorResponse } from '../types/flashSale.types';

export const fetchFlashSales = async (token: string, pageNumber: number = 1, pageSize: number = 100): Promise<PaginatedResponse<FlashSale>> => {
  try {
    if (!token) {
      console.log('Thiếu token');
      return { items: [], totalItems: 0, currentPage: 1, totalPages: 1, pageSize, hasPreviousPage: false, hasNextPage: false };
    }
    console.log('Gửi yêu cầu API fetchFlashSales:', { token, pageNumber, pageSize });
    const response = await axiosInstance.get('/api/ServicePromotion/get-all', {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNumber, pageSize },
    });
    const responseData: ApiResponse<PaginatedResponse<FlashSale>> = response.data;
    console.log('Phản hồi API fetchFlashSales:', responseData);
    return responseData.data || { items: [], totalItems: 0, currentPage: 1, totalPages: 1, pageSize, hasPreviousPage: false, hasNextPage: false };
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    console.log('Lỗi fetchFlashSales:', { errorMessage: axiosError.message, status: axiosError.response?.status });
    return { items: [], totalItems: 0, currentPage: 1, totalPages: 1, pageSize, hasPreviousPage: false, hasNextPage: false };
  }
};

export const createFlashSale = async (token: string, payload: {
  serviceId: string;
  discountPercent: number;
  discountAmount: number;
  quantity: number;
  startDate: string;
  endDate: string;
}) => {
  try {
    console.log('Gửi yêu cầu API createFlashSale:', { payload, token });
    const response = await axiosInstance.post<ApiResponse<any>>('/api/ServicePromotion', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Phản hồi API createFlashSale:', response.data);
    return response.data.data;
  } catch (err: any) {
    const axiosError = err as AxiosError<ErrorResponse>;
    let errorMessage = axiosError.response?.data?.message || 'Lỗi khi thêm flash sale';
    if (axiosError.response?.status === 400 && axiosError.response?.data?.errors) {
      errorMessage = Object.values(axiosError.response.data.errors).flat().join(', ');
    } else if (axiosError.response?.status === 401) {
      errorMessage = 'Phiên đăng nhập không hợp lệ';
    } else if (axiosError.response?.status === 404) {
      errorMessage = 'Không tìm thấy dịch vụ hoặc nhà cung cấp';
    } else if (axiosError.response?.status === 405) {
      errorMessage = 'Phương thức không được phép';
    } else if (axiosError.response?.status === 500) {
      errorMessage = 'Lỗi server, vui lòng thử lại sau';
    }
    console.error('Lỗi createFlashSale:', { errorMessage, status: axiosError.response?.status, response: axiosError.response?.data });
    throw new Error(errorMessage);
  }
};

export const updateFlashSale = async (token: string, payload: {
  id: string;
  serviceId: string;
  discountPercent: number;
  discountAmount: number;
  quantity: number;
  startDate: string;
  endDate: string;
}) => {
  try {
    console.log('Gửi yêu cầu API updateFlashSale:', { payload, token });
    const response = await axiosInstance.put<ApiResponse<any>>('/api/ServicePromotion', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Phản hồi API updateFlashSale:', response.data);
    return response.data.data;
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    console.error('Lỗi updateFlashSale:', { errorMessage: axiosError.message, status: axiosError.response?.status });
    throw new Error(axiosError.response?.data?.message || 'Lỗi khi cập nhật flash sale');
  }
};

export const deleteFlashSale = async (token: string, id: string) => {
  try {
    console.log('Gửi yêu cầu API deleteFlashSale:', { id, token });
    const response = await axiosInstance.delete(`/api/ServicePromotion/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Phản hồi API deleteFlashSale:', response.data);
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    console.error('Lỗi deleteFlashSale:', { errorMessage: axiosError.message, status: axiosError.response?.status });
    throw new Error(axiosError.response?.data?.message || 'Lỗi khi xóa flash sale');
  }
};