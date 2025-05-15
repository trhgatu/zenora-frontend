import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { RoleTable } from "../components/RoleTable"
import { getAllRoles, deleteRoleById } from "../services/roleService"
import { Role } from "../types/role"
import ROUTERS from "@/constants/router"

export const ManageRolePage = () => {
  const navigate = useNavigate()
  const [roles, setRoles] = useState<Role[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)

  useEffect(() => {
    const fetch = async () => {
      const res = await getAllRoles(page + 1, 10)
      setRoles(res.items)
      setPageCount(res.totalPages)
    }
    fetch()
  }, [page])

  const handleEdit = (role: Role) => {
    navigate(ROUTERS.ADMIN.role.edit(role.id))
  }

  const handleDelete = async (role: Role) => {
    if (window.confirm(`Are you sure you want to delete ${role.roleName}?`)) {
      await deleteRoleById(role.id)
      setRoles((prev) => prev.filter((r) => r.id !== role.id))
    }
  }

  return (
    <div className="p-6">
      <h2 className="font-semibold mb-4">
        Manage Roles
      </h2>
      <RoleTable
        data={roles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={{
          pageIndex: page,
          pageCount: pageCount,
          onPageChange: setPage,
        }}
      />
    </div>
  )
}
