import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { getAllUsers } from "@/features/admin/manage-users/services/userServices"
import { User } from "@/features/admin/manage-users/types/user";
import { UserTable } from "@/features/admin/manage-users/components/UserTable";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/router";
import PageLoaderWrapper from "@/components/PageLoaderWrapper";

export const ManageUserPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await getAllUsers(page + 1, 10);
        setUsers(res.items);
        setPageCount(res.totalPages);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);


  const handleEdit = (user: User) => {
    navigate(ROUTERS.ADMIN.user.edit(user.id))
  }

  const handleShow = (user: User) => {
    navigate(ROUTERS.ADMIN.user.show(user.id))
  }

  /* const handleDelete = async (role: Role) => {
    if (window.confirm(`Are you sure you want to delete ${role.roleName}?`)) {
      await deleteRoleById(role.id)
      setRoles((prev) => prev.filter((r) => r.id !== role.id))
    }
  } */
  return (
    <PageLoaderWrapper loading={loading} tip="Đang tải danh sách người dùng">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">
            Quản lý người dùng
          </h2>
          <Button onClick={() => navigate(ROUTERS.ADMIN.user.create)}>
            Create user
          </Button>
        </div>
        <UserTable
          data={users}
          onEdit={handleEdit}
          onShow={handleShow}
          pagination={{
            pageIndex: page,
            pageCount: pageCount,
            onPageChange: setPage,
          }}
        />
      </div>
    </PageLoaderWrapper>
  )
}