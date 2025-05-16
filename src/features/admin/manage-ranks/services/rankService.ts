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
