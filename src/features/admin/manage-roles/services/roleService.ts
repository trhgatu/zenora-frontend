import axiosInstance from "@/services/axios"
import { Role, RoleCreateRequest, RoleUpdateRequest } from "@/features/admin/manage-roles/types/role";

export const getAllRoles = async (page: number, size: number) => {
    const response = await axiosInstance.get("/Role/get-all", {
        params: {
            pageNumber: page,
            pageSize: size,
        },
    });
    return response.data.data;
}

export const getRoleById = async (id: string): Promise<Role> => {
  const response = await axiosInstance.get(`/Role/${id}`)
  return response.data.data
}

export const deleteRoleById = async (id: string) => {
  const response = await axiosInstance.delete(`/Role/${id}`)
  return response.data
}

export const createRole = async (data: RoleCreateRequest) => {
  const response = await axiosInstance.post("/Role/create", data)
  return response.data
}

export const updateRole = async (data: RoleUpdateRequest) => {
  const response = await axiosInstance.put("/Role/update", data)
  return response.data
}
