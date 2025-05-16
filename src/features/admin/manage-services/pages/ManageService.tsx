import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { ServiceTable } from "@/features/admin/manage-services/components/ServiceTable";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/router";
import { Service } from "@/features/admin/manage-services/types/service";
import { getAllServices } from "@/features/admin/manage-services/services/serviceServices";

export const ManageServicePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)

  useEffect(() => {
    const fetchServices = async () => {
      const res = await getAllServices(page + 1, 10)
      setServices(res.items)
      setPageCount(res.totalPages)
    };
    fetchServices();
  }, [page]);

  const handleEdit = (service: Service) => {
    navigate(ROUTERS.ADMIN.user.edit(service.id))
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
          Services Management
        </h2>
        <Button onClick={() => navigate(ROUTERS.ADMIN.service.create)}>
          Create Service
        </Button>
      </div>
      <ServiceTable
        data={services}
        onEdit={handleEdit}
        /* onDelete={handleDeleteService} */
        pagination={{
          pageIndex: page,
          pageCount:pageCount,
          onPageChange: setPage,
        }}
      />

    </div>
  )
}