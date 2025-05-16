import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { RoleTable } from "../components/RoleTable";
import { getAllRoles, deleteRoleById } from "../services/roleService";
import { Role } from "@/features/admin/manage-roles/types/role";
import ROUTERS from "@/constants/router";
import { Button } from "@/components/ui/button";
import PageLoaderWrapper from "@/components/PageLoaderWrapper";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
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
        toast.success("Role deleted successfully");
      } catch {
        toast.error("Failed to delete role");
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

        <AlertDialog open={!!roleToDelete} onOpenChange={(open) => !open && setRoleToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xoá</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xoá vai trò <strong>{roleToDelete?.roleName}</strong> không? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Huỷ</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Xoá</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageLoaderWrapper>
  );

};
