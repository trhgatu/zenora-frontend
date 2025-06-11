import axios from 'axios';
import { Location } from '@/types/location';
export const fetchProvinces = async (): Promise<Location[]> => {
  const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
  return response.data.data;
};

export const fetchDistricts = async (provinceId: string): Promise<Location[]> => {
  const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
  return response.data.data;
};