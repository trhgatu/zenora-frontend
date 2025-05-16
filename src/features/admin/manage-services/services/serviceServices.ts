import { ServiceCreateRequest } from "@/features/admin/manage-services/types/service";
import axiosInstance from "@/services/axios";

export const getAllServices = async (page: number, size: number) => {
    const response = await axiosInstance.get("/Service/get-all", {
        params: {
            pageNumber: page,
            pageSize: size,
        },
    });
    return response.data.data;
}

export const createService = async (data: ServiceCreateRequest) => {
    const response = await axiosInstance.post("/Service/create", data)
    return response.data;
}
