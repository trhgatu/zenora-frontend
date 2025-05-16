import { useState, useEffect } from "react"
import { getAllUsers } from "@/features/admin/manage-users/services/userServices"
import { User } from "@/features/admin/manage-users/types/user";
import { UserTable } from "@/features/admin/manage-users/components/UserTable";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/router";

export default function ManageUserPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)

  useEffect(() => {
    const fetchUsers = async () => {
        const res = await getAllUsers(page + 1, 10)
        setUsers(res.items)
        setPageCount(res.totalPages)
    };
    fetchUsers();
  }, [page]);

  const handleEdit = (user: User) => {
    navigate(ROUTERS.ADMIN.user.edit(user.id))
  }

  /* const handleDelete = async (role: Role) => {
    if (window.confirm(`Are you sure you want to delete ${role.roleName}?`)) {
      await deleteRoleById(role.id)
      setRoles((prev) => prev.filter((r) => r.id !== role.id))
    }
  } */
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">
        Roles Management
      </h2>
  {/*     <Button onClick={() => navigate(ROUTERS.ADMIN.role.create)}>
        Create role
      </Button> */}
      </div>
      <UserTable
        data={users}
        onEdit={handleEdit}
        pagination={{
          pageIndex: page,
          pageCount: pageCount,
          onPageChange: setPage,
        }}
      />
    </div>
  )
}