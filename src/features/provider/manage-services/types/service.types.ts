export interface Service {
  id: string;
  categoryId: string;
  providerId: string;
  serviceName: string;
  description: string;
  price: number;
  duration: number;
  isAvailable: boolean;
  createdTime: string;
  lastUpdatedTime: string;
  deletedTime: string | null;
}

export interface ServiceCategory {
  id: string;
  categoryName: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
  createdTime?: string;
  lastUpdatedTime?: string;
  deletedTime?: string | null;
}

export interface ServiceProviderResponse {
  id: string;
  providerId: string;
  businessName: string;
  imageUrl: string;
  description: string;
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
  errors?: { [key: string]: string[] };
}

export interface ServiceFormData {
  categoryId: string;
  serviceName: string;
  description: string;
  price: string;
  duration: string;
  isAvailable?: boolean;
}