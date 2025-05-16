// src/services/service.ts
import api from "../lib/axios"; // dùng đúng relative path từ /services

export const fetchServices = async (
  params?: { pageNumber?: number; pageSize?: number }
) => {
  const response = await api.get("/Service/get-all", {
    params: {
      pageNumber: params?.pageNumber || 1,
      pageSize: params?.pageSize || 10,
    },
  });

  return response.data.data.items;
};
