import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Role } from "@/features/admin/manage-roles/types/role";
import { getRoleById } from "@/features/admin/manage-roles/services/roleService";

export const DetailRolePage = () => {
  const { id } = useParams<{ id: string }>();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getRoleById(id)
        .then((res) => {
          setRole(res);
        })
        .catch(() => {
          setRole(null);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!role) return <p>Không tìm thấy role.</p>;

  return (
    <div className="p-6 space-y-4 max-w-xl">
      <h2 className="text-2xl font-semibold">Chi tiết vai trò</h2>
      <div><strong>ID:</strong> {role.id}</div>
       <div><strong>Tên vai trò:</strong> {role.roleName}</div>
      <div><strong>Tên chuẩn hóa:</strong> {role.normalizedName}</div>
      <div><strong>Thời gian tạo:</strong> {role.createdTime}</div>
      <div><strong>Cập nhật lần cuối vào:</strong> {role.lastUpdatedTime}</div>
      <div><strong>Đã xóa vào:</strong> {role.deletedTime || "Không có"}</div>
    </div>
  );
};
