import axiosInstance from '@/services/axios';
import { AxiosError } from 'axios';
import {
  Appointment,
  PaginatedResponse,
  ErrorResponse,
  Branch,
  Service,
  Promotion,
  PromotionAdmin,
} from '../types/appointmentTypes';

export const appointmentService = {
  getAppointments: async (pageNumber: number, pageSize: number): Promise<PaginatedResponse<Appointment>> => {
    try {
      const response = await axiosInstance.get('/api/Appointment', {
        params: { pageNumber, pageSize },
      });
      console.log('getAppointments: API response:', response.data); // Log để debug
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error('getAppointments: Error:', axiosError.response?.data || axiosError.message);
      throw new Error(axiosError.response?.data?.message || 'Lỗi khi lấy danh sách lịch hẹn');
    }
  },

  updateStatus: async (id: string, status: string): Promise<void> => {
    try {
      await axiosInstance.patch(`/api/Appointment/status/${id}?status=${status}`);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    }
  },

  softDeleteAppointment: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/Appointment/${id}`);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Lỗi khi xóa lịch hẹn');
    }
  },

  getAppointmentById: async (id: string): Promise<Appointment> => {
    try {
      const response = await axiosInstance.get(`/api/Appointment/${id}`);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Lỗi khi lấy chi tiết lịch hẹn');
    }
  },

  getProviderBranches: async (providerId: string): Promise<Branch[]> => {
    try {
      const response = await axiosInstance.get(`/api/SpaBranchLocation/by-provider/${providerId}`);
      console.log('getProviderBranches: API response:', response.data); // Log để debug
      const branches = response.data.data?.items || response.data.data || [];
      return branches;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error('getProviderBranches: Error:', axiosError.response?.data || axiosError.message);
      throw new Error(axiosError.response?.data?.message || 'Lỗi khi lấy danh sách chi nhánh');
    }
  },

  getProviderServices: async (providerId: string): Promise<Service[]> => {
    try {
      const response = await axiosInstance.get(`/api/Service/by-provider/${providerId}`, {
        params: { pageNumber: 1, pageSize: 100 },
      });
      return response.data.data || [];
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Lỗi khi lấy danh sách dịch vụ');
    }
  },

  getPromotions: async (): Promise<Promotion[]> => {
    try {
      const response = await axiosInstance.get('/api/Promotion/all', {
        params: { page: 1, size: 100 },
      });
      return response.data.data.items || [];
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Lỗi khi lấy danh sách khuyến mãi');
    }
  },

  getAdminPromotions: async (): Promise<PromotionAdmin[]> => {
    try {
      const response = await axiosInstance.get('/api/PromotionAdmin/getall');
      return response.data.data || [];
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Lỗi khi lấy danh sách khuyến mãi admin');
    }
  },
};