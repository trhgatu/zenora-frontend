import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { updateUser, getUserById } from "@/features/admin/manage-users/services/userServices";
import { uploadImageToCloudinary } from "@/services/cloudinaryUpload";
import { fetchProvinces, fetchDistricts } from "@/services/locationAPI";

interface UserData {
  avatarUrl: string;
  gender: string;
  dateOfBirth: string;
  fullName: string;
  addressDetail: string;
  provinceId: string;
  districtId: string;
  phoneNumber: string;
}

export const EditUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<UserData>({
    avatarUrl: "",
    gender: "",
    dateOfBirth: "",
    fullName: "",
    addressDetail: "",
    provinceId: "",
    districtId: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<UserData>>({});

  // Fetch provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const provinceData = await fetchProvinces();
        setProvinces(provinceData);
      } catch (error) {
        console.error("Không thể tải danh sách tỉnh/thành:", error);
      }
    };
    loadProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (userData.provinceId) {
        try {
          const districtData = await fetchDistricts(userData.provinceId);
          setDistricts(districtData);
        } catch (error) {
          console.error("Không thể tải danh sách quận/huyện:", error);
        }
      } else {
        setDistricts([]);
      }
    };
    loadDistricts();
  }, [userData.provinceId]);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        try {
          const data = await getUserById(id);
          setUserData(data);
        } catch (error) {
          console.error("Không thể tải thông tin người dùng:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUser();
  }, [id]);

  const validateForm = useCallback(() => {
    const newErrors: Partial<UserData> = {};
    if (!userData.fullName.trim()) newErrors.fullName = "Họ và tên là bắt buộc";
    if (!userData.phoneNumber.match(/^\d{10,11}$/)) newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    if (!userData.provinceId) newErrors.provinceId = "Vui lòng chọn tỉnh/thành";
    if (!userData.districtId) newErrors.districtId = "Vui lòng chọn quận/huyện";
    if (!userData.addressDetail.trim()) newErrors.addressDetail = "Địa chỉ chi tiết là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [userData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      let updatedData = { ...userData };

      // Upload image if selected
      if (imageFile) {
        const imageUrl = await uploadImageToCloudinary(URL.createObjectURL(imageFile));
        updatedData = { ...updatedData, avatarUrl: imageUrl };
      }

      if (id) {
        await updateUser(id, updatedData);
        alert("Cập nhật thông tin người dùng thành công!");
      }
    } catch (error) {
      console.error("Cập nhật thông tin người dùng thất bại:", error);
      alert("Cập nhật thông tin người dùng thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa thông tin người dùng</h1>
      <p className="text-gray-600 mb-4">Đang chỉnh sửa người dùng với ID: {id}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ảnh đại diện</label>
          {userData.avatarUrl && (
            <img
              src={userData.avatarUrl}
              alt="Ảnh đại diện"
              className="w-24 h-24 rounded-full mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Giới tính</label>
          <select
            name="gender"
            value={userData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ngày sinh</label>
          <input
            type="date"
            name="dateOfBirth"
            value={userData.dateOfBirth}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Họ và tên</label>
          <input
            type="text"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố</label>
          <select
            name="provinceId"
            value={userData.provinceId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
          {errors.provinceId && (
            <p className="text-red-500 text-sm">{errors.provinceId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quận/Huyện</label>
          <select
            name="districtId"
            value={userData.districtId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled={!userData.provinceId}
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
          {errors.districtId && (
            <p className="text-red-500 text-sm">{errors.districtId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Địa chỉ chi tiết</label>
          <input
            type="text"
            name="addressDetail"
            value={userData.addressDetail}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.addressDetail && (
            <p className="text-red-500 text-sm">{errors.addressDetail}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Số điện thoại</label>
          <input
            type="tel"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {submitting ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
};