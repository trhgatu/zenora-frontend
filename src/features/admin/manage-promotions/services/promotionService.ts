import { CreatePromotionRequest, Promotion } from "@/features/admin/manage-promotions/types/promotion";
import axiosInstance from "@/services/axios";

export const getAllPromotions = async (page: number, size: number): Promise<{
    data: Promotion[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}> => {
    const res = await axiosInstance.get("/PromotionAdmin/getall", {
        params: {
            pageNumber: page,
            pageSize: size,
        },
    });

    return {
        data: res.data.data,
        currentPage: res.data.data.currentPage,
        totalPages: res.data.data.totalPages,
        totalItems: res.data.data.totalItems,
    };
};

export const getPromotionById = async (id: string) => {
    const response = await axiosInstance.get(`/PromotionAdmin/get-by-id/${id}`)
    return response.data.data
}

export const createPromotion = async (data: CreatePromotionRequest) => {
    const response = await axiosInstance.post("/PromotionAdmin/create", data);
    return response.data;
}