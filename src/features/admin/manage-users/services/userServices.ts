import axiosInstance from "@/services/axios";
import { UserUpdatePayload } from "@/features/admin/manage-users/types/user";

export const getAllUsers = async (page: number, size: number) => {
    const response = await axiosInstance.get("/User/get-all", {
        params: {
            pageNumber: page,
            pageSize: size,
        },
    });
    return response.data.data;
}

export const getUserById = async (id: string) => {
    const response = await axiosInstance.get(`/User/${id}`);
    return response.data.data;
}

export const updateUser = async (id: string, userData: Omit<UserUpdatePayload, "id">) => {
  const response = await axiosInstance.put("/api/User/update", {
    id,
    ...userData,
  });
  return response.data.data;
};

export const softDeleteUserById = async (id: string) => {
  const response = await axiosInstance.delete(`/User/Delete/${id}`)
  return response.data
}