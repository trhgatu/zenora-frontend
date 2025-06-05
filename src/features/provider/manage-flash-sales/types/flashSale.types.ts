export interface FlashSale {
  id: string;
  serviceId: string;
  discountPercent: number;
  discountAmount: number;
  quantity: number;
  startDate: string;
  endDate: string;
  createdTime: string;
  lastUpdatedTime: string;
  deletedTime: string | null;
}

export interface Service {
  id: string;
  serviceName: string;
}

export interface ServiceProviderResponse {
  id: string;
  providerId: string;
  businessName: string;
  imageUrl: string;
  description: string;
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
  data?: any;
  additionalData?: any;
  message?: string;
  statusCode?: number;
  code?: string;
  detail?: string;
  errors?: any;
}