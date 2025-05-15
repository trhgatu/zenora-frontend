import { useState, useEffect } from "react"
import { getAllRoles } from "@/features/admin/manage-roles/services/roleService";
import { RoleTable } from "@/features/admin/manage-roles/components/RoleTable";
import { Role } from "@/features/admin/manage-roles/types/role";

export default function ManageRolePage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [pageIndex, setPageIndex] = useState(0)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getAllRoles(pageIndex + 1, 10)
        setRoles(response.items)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.error("Failed to fetch roles", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
  }, [pageIndex])
  const handleEdit = (role: Role) => {
    console.log("Edit", role)
    // open modal or navigate to edit page
  }

  const handleDelete = (role: Role) => {
    console.log("Delete", role)
    // confirm and call delete API
  }
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Roles</h2>
      {loading ? <p>Loading...</p> : <RoleTable
        data={roles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={{
          pageIndex,
          pageCount: totalPages,
          onPageChange: setPageIndex,
        }}
      />}
    </div>
  )
}
