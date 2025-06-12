export interface Appointment {
  id?: string;
  appointmentDate: string;
  startTime: string;
  spaBranchLocationId?: string;
  notes?: string;
  services: AppointmentServiceData[];
  paymentMethod?: string;
  bookingStatus?: string;
  customerName?: string;
  originalTotalPrice?: number;
  discountAmount?: number;
  finalPrice?: number;
  branchName?: string;
  street?: string;
  districtName?: string;
  provinceName?: string;
  promotionId?: string;
  promotionAdminId?: string;
}

export interface AppointmentServiceData {
  serviceId: string;
  serviceName?: string;
  priceAtBooking?: number;
  quantity: number;
}

export interface PaginatedResponse<T> {
  data: {
    items: T[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
  statusCode: number;
  message?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'canceled' | 'no_show';

export interface ErrorResponse {
  message?: string;
  statusCode?: number;
  errors?: { [key: string]: string[] } | string[] | string;
}

export interface Branch {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  serviceName: string;
}

export interface Promotion {
  id: string;
  name: string;
}

export interface PromotionAdmin {
  id: string;
  name: string;
}