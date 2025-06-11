import axiosInstance from '@/services/axios';

export const getAllSpaBranches = async (page:number, size:number) => {
    const response = await axiosInstance.get('/SpaBranchLocation/get-all', {
        params: {
            pageNumber: page,
            pageSize: size,
        },
    });
    return response.data.data;
};

export const getSpaBranchesByProviderId = async (providerId:string) => {
    const response = await axiosInstance.get(`/SpaBranchLocation/by-provider/${providerId}`);
    return response.data.data;
};

export const getSpaBranchById = async (id: string) => {
    const response = await axiosInstance.get(`/SpaBranchLocation/get/${id}`);
    return response.data.data; 
};