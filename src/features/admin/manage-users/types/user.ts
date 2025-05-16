// src/features/admin/manage-users/types/user.ts
export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string | null;
  address: string;
  dateOfBirth: string;
  avatarUrl: string | null;
  isActive: boolean;
  roleName: string;
  createdTime: string;
  lastUpdatedTime: string;
}
