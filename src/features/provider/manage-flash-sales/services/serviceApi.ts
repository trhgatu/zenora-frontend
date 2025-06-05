import axiosInstance from '@/services/axios';
import { AxiosError } from 'axios';
import { Service, ApiResponse, ErrorResponse } from '../types/flashSale.types';

export const fetchServices = async (providerId: string, token: string): Promise<Service[]> => {
  try {
    if (!providerId || !token) {
      console.log('Thiếu providerId hoặc token:', { providerId, token });
      return [];
    }
    console.log('Gửi yêu cầu API fetchServices:', { providerId, token });
    const response = await axiosInstance.get<ApiResponse<Service[]>>(
      `/api/Service/by-provider/${providerId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNumber: 1, pageSize: 100 },
      }
    );
    console.log('Phản hồi API fetchServices:', response.data);
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    console.log('Lỗi fetchServices:', { errorMessage: axiosError.message, status: axiosError.response?.status });
    if (axiosError.response?.status === 404) {
      console.log('Không tìm thấy dịch vụ cho providerId:', providerId);
      return []; // Trả về mảng rỗng nếu không có dịch vụ
    }
    throw new Error(axiosError.response?.data?.message || 'Lỗi khi lấy danh sách dịch vụ');
  }
};