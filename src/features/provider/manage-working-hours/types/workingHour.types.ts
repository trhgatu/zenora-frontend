export interface WorkingHour {
  id?: string; // Optional for create
  dayOfWeek: number; // 0 = Chủ Nhật, 1 = Thứ 2, ..., 6 = Thứ 7
  openingTime: string; // Format: HH:mm
  closingTime: string; // Format: HH:mm
  isWorking: boolean;
  providerId: string;
  spaBranchLocationId: string;
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
  errors?: { [key: string]: string[] };
}