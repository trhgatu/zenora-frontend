import axiosInstance from '@/services/axios';
import { AxiosError } from 'axios';
import { Staff, Branch, ServiceCategory, ApiResponse, PaginatedResponse, ErrorResponse } from '../types/staff.types';

export const fetchBranches = async (providerId: string, token: string): Promise<Branch[]> => {
  try {
    if (!providerId || !token) {
      console.log('Thiếu providerId hoặc token:', { providerId, token });
      return [];
    }
    console.log('Gửi yêu cầu API fetchBranches:', { providerId, token });
    const response = await axiosInstance.get<ApiResponse<Branch[]>>(
      `/api/SpaBranchLocation/by-provider/${providerId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('Phản hồi API fetchBranches:', response.data);
    return response.data.data || [];
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    console.log('Lỗi fetchBranches:', { errorMessage: axiosError.message, status: axiosError.response?.status });
    return [];
  }
};

export const fetchServiceCategories = async (token: string): Promise<ServiceCategory[]> => {
  try {
    if (!token) {
      console.log('Thiếu token');
      return [];
    }
    console.log('Gửi yêu cầu API fetchServiceCategories:', { token });
    const response = await axiosInstance.get<ApiResponse<{ items: ServiceCategory[] }>>(
      '/api/ServiceCategory/get-all',
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNumber: 1, pageSize: 100 },
      }
    );
    console.log('Phản hồi API fetchServiceCategories:', response.data);
    return response.data.data.items || [];
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    console.log('Lỗi fetchServiceCategories:', { errorMessage: axiosError.message, status: axiosError.response?.status });
    return [];
  }
};

export const fetchStaff = async (token: string, pageNumber: number, pageSize: number): Promise<PaginatedResponse<Staff>> => {
  try {
    if (!token) {
      console.log('Thiếu token');
      return { items: [], totalItems: 0, currentPage: 1, totalPages: 1, pageSize, hasPreviousPage: false, hasNextPage: false };
    }
    console.log('Gửi yêu cầu API fetchStaff:', { token, pageNumber, pageSize });
    const response = await axiosInstance.get('/api/Staff/get-all', {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageNumber, pageSize },
    });
    const responseData: ApiResponse<PaginatedResponse<Staff>> = response.data;
    console.log('Phản hồi API fetchStaff:', responseData);
    return responseData.data || { items: [], totalItems: 0, currentPage: 1, totalPages: 1, pageSize, hasPreviousPage: false, hasNextPage: false };
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    console.log('Lỗi fetchStaff:', { errorMessage: axiosError.message, status: axiosError.response?.status });
    return { items: [], totalItems: 0, currentPage: 1, totalPages: 1, pageSize, hasPreviousPage: false, hasNextPage: false };
  }
};

export const fetchStaffByBranch = async (branchId: string, token: string): Promise<Staff[]> => {
  try {
    if (!token || !branchId) {
      console.log('Thiếu token hoặc branchId:', { branchId, token });
      return [];
    }
    console.log('Gửi yêu cầu API fetchStaffByBranch:', { branchId, token });
    const response = await axiosInstance.get(`/api/Staff/by-branch/${branchId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const responseData: ApiResponse<Staff[]> = response.data;
    console.log('Phản hồi API fetchStaffByBranch:', responseData);
    return responseData.data || [];
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    console.log('Lỗi fetchStaffByBranch:', { errorMessage: axiosError.message, status: axiosError.response?.status });
    return [];
  }
};

export const fetchStaffById = async (staffId: string, token: string): Promise<Staff> => {
  try {
    if (!token || !staffId) {
      console.log('Thiếu token hoặc staffId:', { staffId, token });
      throw new Error('Thiếu thông tin yêu cầu');
    }
    console.log('Gửi yêu cầu API fetchStaffById:', { staffId, token });
    const response = await axiosInstance.get<ApiResponse<Staff>>(`/api/Staff/${staffId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Phản hồi API fetchStaffById:', response.data);
    return response.data.data;
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    console.log('Lỗi fetchStaffById:', { errorMessage: axiosError.message, status: axiosError.response?.status });
    throw new Error(axiosError.response?.data?.message || 'Lỗi khi lấy thông tin nhân viên');
  }
};

export const createStaff = async (token: string, staff: Omit<Staff, 'id' | 'createdTime' | 'lastUpdatedTime' | 'deletedTime'>): Promise<Staff> => {
  try {
    console.log('Gửi yêu cầu API createStaff:', { staff, token });
    const response = await axiosInstance.post<ApiResponse<Staff>>('/api/Staff', staff, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Phản hồi API createStaff:', response.data);
    return response.data.data;
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    let errorMessage = axiosError.response?.data?.message || 'Lỗi khi thêm nhân viên';
    if (axiosError.response?.status === 500) {
      errorMessage = 'Lỗi server khi thêm nhân viên.';
    }
    console.error('Lỗi createStaff:', { errorMessage, status: axiosError.response?.status });
    throw new Error(errorMessage);
  }
};

export const updateStaff = async (token: string, staff: Partial<Staff> & { id: string }): Promise<Staff> => {
  try {
    console.log('Gửi yêu cầu API updateStaff:', { staff, token });
    const response = await axiosInstance.put<ApiResponse<Staff>>('/api/Staff', staff, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Phản hồi API updateStaff:', response.data);
    return response.data.data;
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    let errorMessage = axiosError.response?.data?.message || 'Lỗi khi cập nhật nhân viên';
    if (axiosError.response?.status === 500) {
      errorMessage = 'Lỗi server khi cập nhật nhân viên.';
    }
    console.error('Lỗi updateStaff:', { errorMessage, status: axiosError.response?.status });
    throw new Error(errorMessage);
  }
};

export const deleteStaff = async (token: string, id: string): Promise<void> => {
  try {
    console.log('Gửi yêu cầu API deleteStaff:', { id, token });
    const response = await axiosInstance.delete(`/api/Staff/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Phản hồi API deleteStaff:', response.data);
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    let errorMessage = axiosError.response?.data?.message || 'Lỗi khi xóa nhân viên';
    if (axiosError.response?.status === 500) {
      errorMessage = 'Lỗi server khi xóa nhân viên.';
    }
    console.error('Lỗi deleteStaff:', { errorMessage, status: axiosError.response?.status });
    throw new Error(errorMessage);
  }
};