import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { RoleTable } from "../components/RoleTable";
import { getAllRoles, deleteRoleById } from "../services/roleService";
import { Role } from "@/features/admin/manage-roles/types/role";
import ROUTERS from "@/constants/router";
import { Button } from "@/components/ui/button";
import PageLoaderWrapper from "@/components/PageLoaderWrapper";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { toast } from "sonner";

export const ManageRolePage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);

      try {
        const res = await getAllRoles(page + 1, 10);
        setRoles(res.items);
        setPageCount(res.totalPages);
        setLoading(false)
      } catch (err) {
        console.error(err)
        toast.error("Không thể tải danh sách vai trò.");
        setLoading(false);
      }
    };

    fetchRoles();
  }, [page]);

  const handleEdit = (role: Role) => navigate(ROUTERS.ADMIN.role.edit(role.id));
  const handleShow = (role: Role) => navigate(ROUTERS.ADMIN.role.show(role.id));

  const confirmDelete = async () => {
    if (roleToDelete) {
      try {
        await deleteRoleById(roleToDelete.id);
        setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id));
        toast.success("Xóa vai trò thành công");
      } catch {
        toast.error("Có lỗi xảy ra khi xóa vai trò");
      } finally {
        setRoleToDelete(null);
      }
    }
  };

  return (
    <PageLoaderWrapper loading={loading} tip="Đang tải vai trò...">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Roles Management</h2>
          <Button onClick={() => navigate(ROUTERS.ADMIN.role.create)}>Create role</Button>
        </div>

        <RoleTable
          data={roles}
          onEdit={handleEdit}
          onDelete={(role) => setRoleToDelete(role)}
          onShow={handleShow}
          pagination={{
            pageIndex: page,
            pageCount: pageCount,
            onPageChange: setPage,
          }}
        />

        <ConfirmDeleteDialog
          open={!!roleToDelete}
          itemName={roleToDelete?.roleName || ""}
          onCancel={() => setRoleToDelete(null)}
          onConfirm={confirmDelete}
        />


      </div>
    </PageLoaderWrapper>
  );

};
