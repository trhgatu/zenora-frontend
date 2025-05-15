import axiosInstance from "@/services/axios";

export const getAllUsers = async () => {
    const response = await axiosInstance.get("/User/get-all?pageNumber=1&pageSize=10");
    return response.data
}