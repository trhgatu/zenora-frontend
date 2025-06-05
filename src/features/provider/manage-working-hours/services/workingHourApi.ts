import axios, { AxiosError } from 'axios'; // Thêm import AxiosError
import { WorkingHour, PaginatedResponse, ApiResponse, ErrorResponse } from '../types/workingHour.types';

// Giả định axiosInstance được cấu hình như sau
const axiosInstance = axios.create({
  baseURL: '/api', // Điều chỉnh baseURL theo môi trường của bạn
});

export const fetchWorkingHours = async (
  token: string,
  pageNumber: number,
  pageSize: number
): Promise<PaginatedResponse<WorkingHour>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<WorkingHour>>>(
      `/WorkingHour?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.data;
  } catch (error: any) {
    const err = error as AxiosError<ErrorResponse>;
    throw new Error(err.response?.data?.message || 'Lỗi khi lấy danh sách giờ làm việc');
  }
};

export const createWorkingHour = async (token: string, data: WorkingHour): Promise<WorkingHour> => {
  try {
    const response = await axiosInstance.post<ApiResponse<WorkingHour>>('/WorkingHour', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    const err = error as AxiosError<ErrorResponse>;
    throw new Error(err.response?.data?.message || 'Lỗi khi tạo giờ làm việc');
  }
};

export const updateWorkingHour = async (token: string, data: WorkingHour): Promise<WorkingHour> => {
  try {
    const response = await axiosInstance.put<ApiResponse<WorkingHour>>('/WorkingHour', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    const err = error as AxiosError<ErrorResponse>;
    throw new Error(err.response?.data?.message || 'Lỗi khi cập nhật giờ làm việc');
  }
};

export const fetchWorkingHourById = async (token: string, id: string): Promise<WorkingHour> => {
  try {
    const response = await axiosInstance.get<ApiResponse<WorkingHour>>(`/WorkingHour/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    const err = error as AxiosError<ErrorResponse>;
    throw new Error(err.response?.data?.message || 'Lỗi khi lấy chi tiết giờ làm việc');
  }
};

export const deleteWorkingHour = async (token: string, id: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`/WorkingHour/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status !== 200) {
      throw new Error('Lỗi khi xóa giờ làm việc');
    }
  } catch (error: any) {
    const err = error as AxiosError<ErrorResponse>;
    throw new Error(err.response?.data?.message || 'Lỗi khi xóa giờ làm việc');
  }
};