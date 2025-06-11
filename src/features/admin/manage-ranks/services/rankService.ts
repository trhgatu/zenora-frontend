import { Rank } from "@/features/admin/manage-ranks/types/rank";
import axiosInstance from "@/services/axios"

export const getAllRanks = async (page: number, size: number) => {
  const response = await axiosInstance.get("/Rank/getall/ranks", {
    params: {
      pageNumber: page,
      pageSize: size,
    },
  });
  return response.data.data;
}

export const createRank = async (data: {
  name: string;
  minPoints: number;
  discountPercent: number;
  description?: string;
}) => {
  const res = await axiosInstance.post("/Rank/create/rank", data);
  return res.data;
};

export const getRankById = async (id: string): Promise<Rank> => {
  const response = await axiosInstance.get(`/Rank/get/${id}`)
  return response.data.data
}
export const deleteRankById = async (id: string) => {
  const response = await axiosInstance.delete(`/Rank/delete/rank/${id}`);
  return response.data;
}
