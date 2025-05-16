import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { getRoleById, updateRole } from "../services/roleService";
import { toast } from "sonner";
import { Flex, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import BackButton from "@/components/BackButton";

const schema = z.object({
  id: z.string(),
  roleName: z.string().min(2, "Tên vai trò phải có ít nhất 2 ký tự"),
});

type EditRoleFormData = z.infer<typeof schema>;

export const EditRolePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditRoleFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: id ?? "",
      roleName: "",
    },
  });

  useEffect(() => {
    const fetchRole = async () => {
      try {
        if (!id) return;
        const role = await getRoleById(id);
        setValue("id", role.id);
        setValue("roleName", role.roleName);
      } catch {
        toast.error("Không thể tải vai trò.");
        navigate("/admin/roles");
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [id, navigate, setValue]);

  const onSubmit = async (data: EditRoleFormData) => {
    try {
      await updateRole(data);
      toast.success("Cập nhật vai trò thành công!");
      navigate("/admin/roles");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật vai trò thất bại.");
    }
  };

  if (loading) {
    return (
      <Flex align="center" gap="middle">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </Flex>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Chỉnh sửa vai trò</h2>
        <BackButton />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên vai trò
          </label>
          <Input
            type="text"
            {...register("roleName")}
            className="w-full"
            placeholder="Nhập tên vai trò"
          />
          {errors.roleName && (
            <p className="text-sm text-red-500 mt-1">{errors.roleName.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </div>
      </form>
    </div>
  );
};
