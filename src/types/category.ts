export interface ServiceCategory {
  id: string;
  categoryName: string;
  iconUrl?: string | null;
  isActive: boolean;
  createdTime: string;
  lastUpdatedTime: string;
}
export interface CreateServiceCategoryRequest {
  categoryName: string,
  isActive?: boolean
}