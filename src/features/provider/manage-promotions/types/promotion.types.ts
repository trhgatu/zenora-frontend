export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  discountAmount: number;
  quantity: number;
  startDate: string;
  endDate: string;
  createdTime: string;
  lastUpdatedTime: string;
  deletedTime: string | null;
}

export interface ServiceFormData {
  title: string;
  description: string;
  discountPercent: string;
  discountAmount: string;
  quantity: string;
  startDate: string;
  endDate: string;
}

export interface ApiResponse<T> {
  data: T;
  additionalData: any;
  message: string | null;
  statusCode: number;
  code: string;
}

export interface ErrorResponse {
  data?: any;
  additionalData?: any;
  message?: string;
  statusCode?: number;
  code?: string;
  detail?: string;
  errors?: any;
}