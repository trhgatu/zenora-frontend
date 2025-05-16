import axiosInstance from "@/services/axios";

export const getAllServices = async (page: number, size: number) => {
    const response = await axiosInstance.get("/Service/get-all", {
        params: {
            pageNumber: page,
            pageSize: size,
        },
    });
    return response.data.data
}