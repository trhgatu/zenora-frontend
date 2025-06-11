import axiosInstance from '@/services/axios';

// Define a basic request body type for statistics (customize as needed)
interface StatisticsRequest {
  startDate?: string;
  endDate?: string;
  category?: string;
}

export const getAdminStatistics = async (page: number, size: number, request: StatisticsRequest = {}) => {
  const response = await axiosInstance.post('/statistic/admin', {
    params: {
      pageNumber: page,
      pageSize: size,
    },
    data: request, 
  });
  return response.data.data;
};

