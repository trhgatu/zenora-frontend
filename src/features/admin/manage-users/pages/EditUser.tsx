import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { getUserById, updateUser } from "@/features/admin/manage-users/services/userServices";
import { uploadImageToCloudinary } from "@/services/cloudinaryUpload";
import { fetchProvinces, fetchDistricts } from "@/services/locationAPI";
import { Location } from "@/types/location";
import { Button } from "@/components/ui/button";
import { Input } from "antd";
import { EditUserSchema } from "@/features/admin/manage-users/validator/user";

type FormData = z.infer<typeof EditUserSchema>;

export const EditUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      avatarUrl: "",
      gender: "",
      dateOfBirth: "",
      fullName: "",
      addressDetail: "",
      provinceId: "",
      districtId: "",
      phoneNumber: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = form;

  const provinceId = watch("provinceId");

  useEffect(() => {
    const loadProvinces = async () => {
      const data = await fetchProvinces();
      setProvinces(data);
    };
    loadProvinces();
  }, []);

  useEffect(() => {
    const loadDistricts = async () => {
      if (provinceId) {
        const data = await fetchDistricts(provinceId);
        setDistricts(data);
      } else {
        setDistricts([]);
      }
    };
    loadDistricts();
  }, [provinceId]);

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        try {
          const res = await getUserById(id);
          const userData = res.data;

          const formattedData: FormData = {
            fullName: userData.fullName || "",
            phoneNumber: userData.phoneNumber || "",
            gender: userData.gender || "",
            addressDetail: userData.addressDetail || "",
            provinceId: userData.provinceId || "",
            districtId: userData.districtId || "",
            avatarUrl: userData.avatarUrl || "",
            dateOfBirth:
              userData.dateOfBirth && userData.dateOfBirth !== "0001-01-01T00:00:00"
                ? new Date(userData.dateOfBirth).toISOString().split("T")[0]
                : "",
          };

          reset(formattedData);
        } catch (err) {
          console.error("Lỗi tải dữ liệu người dùng:", err);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      let avatarUrl = data.avatarUrl;

      if (imageFile) {
        avatarUrl = await uploadImageToCloudinary(URL.createObjectURL(imageFile));
      }

      if (id) {
        await updateUser(id, { ...data, avatarUrl });
        alert("Cập nhật thành công");
      }
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Cập nhật thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa người dùng</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Ảnh đại diện</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>

        <div>
          <label>Giới tính</label>
          <select {...register("gender")} className="w-full p-2 border rounded">
            <option value="">Chọn</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
          {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
        </div>

        <div>
          <label>Ngày sinh</label>
          <Input
            type="date"
            {...register("dateOfBirth")}
            className="w-full p-2 border rounded"
          />
          {errors.dateOfBirth && (
            <p className="text-red-500">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <label>Họ và tên</label>
          <Input
            {...register("fullName")}
            className="w-full p-2 border rounded"
          />
          {errors.fullName && (
            <p className="text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label>Tỉnh/Thành phố</label>
          <select
            {...register("provinceId")}
            className="w-full p-2 border rounded"
          >
            <option value="">Chọn tỉnh</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.provinceId && (
            <p className="text-red-500">{errors.provinceId.message}</p>
          )}
        </div>

        <div>
          <label>Quận/Huyện</label>
          <select
            {...register("districtId")}
            className="w-full p-2 border rounded"
            disabled={!provinceId}
          >
            <option value="">Chọn quận</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors.districtId && (
            <p className="text-red-500">{errors.districtId.message}</p>
          )}
        </div>

        <div>
          <label>Địa chỉ chi tiết</label>
          <Input
            {...register("addressDetail")}
            className="w-full p-2 border rounded"
          />
          {errors.addressDetail && (
            <p className="text-red-500">{errors.addressDetail.message}</p>
          )}
        </div>

        <div>
          <label>Số điện thoại</label>
          <Input
            type="tel"
            {...register("phoneNumber")}
            className="w-full p-2 border rounded"
          />
          {errors.phoneNumber && (
            <p className="text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </form>
    </div>
  );
};