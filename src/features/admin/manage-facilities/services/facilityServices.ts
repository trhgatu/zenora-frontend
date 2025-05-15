import axiosInstance from "@/services/axios"

export const getAllFacilities = async () => {
    const response = await axiosInstance.get("/Location/spa");
    return response.data;
}