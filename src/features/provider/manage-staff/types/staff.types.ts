export interface Staff {
  id: string;
  branchId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  avatarUrl: string;
  gender: string;
  yearsOfExperience: number;
  serviceCategoryIds: string[];
  createdTime: string;
  lastUpdatedTime: string;
  deletedTime: string | null;
}

export interface StaffFormData {
  branchId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  avatarUrl: string;
  gender: string;
  yearsOfExperience: number;
  serviceCategoryIds: string[];
}

export interface Branch {
  id: string;
  branchName: string;
}

export interface ServiceCategory {
  id: string;
  categoryName: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  data: T;
  additionalData: any;
  message: string | null;
  statusCode: number;
  code: string;
}

export interface ErrorResponse {
  message?: string;
  statusCode?: number;
  errors?: any;
}