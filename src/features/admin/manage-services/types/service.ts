export interface Service {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  duration: number;
  isAvailable: boolean;
  categoryId: string;
  createdTime: string;
  lastUpdatedTime: string;
}
export interface ServiceCreateRequest {
  serviceName: string,
  description: string,
  price: number,
  duration: number
  isAvailable: boolean;
}
