import axiosInstance from "@/services/axios";
import { CreateServiceCategoryRequest, ServiceCategory } from "@/types/category";

export const getAllCategories = async (page: number, size: number): Promise<{
  data: ServiceCategory[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}> => {
  const res = await axiosInstance.get("/ServiceCategory/get-all", {
    params: {
      pageNumber: page,
      pageSize: size,
    },
  });

  return {
    data: res.data.data.items,
    currentPage: res.data.data.currentPage,
    totalPages: res.data.data.totalPages,
    totalItems: res.data.data.totalItems,
  };
};

export const softDeleteCategoryById = async (id: string) => {
  const response = await axiosInstance.delete(`/ServiceCategory/${id}`)
  return response.data
}

export const createCategory = async (data: CreateServiceCategoryRequest) => {
  const response = await axiosInstance.post("/ServiceCategory/create", data)
  return response.data
}

export const getCategoryById = async (id: string) => {
  const response = await axiosInstance.get(`/ServiceCategory/${id}`)
  return response.data;
}