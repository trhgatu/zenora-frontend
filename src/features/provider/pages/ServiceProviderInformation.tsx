import React, { useEffect, useState } from 'react';
import axiosInstance from '@/services/axios';
import { useAppSelector } from '@/hooks';
import { toast } from 'react-toastify';

interface ProviderInfo {
  id: string;
  businessName: string;
  imageUrl: string;
  description: string;
  contactFullName: string;
  contactPosition: string;
  addressDetail: string;
  provinceName: string;
  districtName: string;
  openTime: string;
  closeTime: string;
  categories: string[];
  images: { id: string; imageUrl: string }[];
}

const ServiceProviderInformation: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const [data, setData] = useState<ProviderInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProviderInfo = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/ServiceProvider/${user?._id}`);
      setData(res.data.data);
    } catch {
      toast.error('Không thể tải thông tin cơ sở');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchProviderInfo();
  }, [user]);

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;
  if (!data) return <p className="text-center mt-10">Không có dữ liệu</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Thông tin cơ sở</h1>
      <div className="bg-white p-6 rounded shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2 text-left">Tên cơ sở</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Chức vụ</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Địa chỉ</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Giờ hoạt động</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Danh mục</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Hình ảnh</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2">
                  {data.businessName || 'N/A'}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {data.contactFullName || 'N/A'}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {data.contactPosition || 'N/A'}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {data.addressDetail && data.districtName && data.provinceName
                    ? `${data.addressDetail}, ${data.districtName}, ${data.provinceName}`
                    : 'N/A'}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {data.openTime && data.closeTime
                    ? `${data.openTime} - ${data.closeTime}`
                    : 'N/A'}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {data.categories?.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {data.categories.map((cat, idx) => (
                        <li key={idx}>{cat}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500">Không có danh mục</span>
                  )}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {data.images?.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {data.images.map((img) => (
                        <img
                          key={img.id}
                          src={img.imageUrl}
                          alt=""
                          className="w-16 h-16 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/64';
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">Không có hình ảnh</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderInformation;