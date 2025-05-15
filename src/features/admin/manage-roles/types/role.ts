export interface Role {
  id: string;
  roleName: string;
  normalizedName: string;
  createdTime: string;
  lastUpdatedTime: string;
  deletedTime: string | null;
}

export interface RoleCreateRequest {
  roleName: string
}

export interface RoleUpdateRequest {
  id: string
  roleName: string
}