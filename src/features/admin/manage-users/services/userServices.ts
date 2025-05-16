import axiosInstance from "@/services/axios";

export const getAllUsers = async (page: number, size: number) => {
    const response = await axiosInstance.get("/User/get-all", {
        params: {
            pageNumber: page,
            pageSize: size,
        },
    });
    return response.data.data
}