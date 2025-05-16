import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { RankTable } from "@/features/admin/manage-ranks/components/RankTable"
import { Rank } from "@/features/admin/manage-ranks/types/rank"
import ROUTERS from "@/constants/router"
import { Button } from "@/components/ui/button"
import { getAllRanks } from "@/features/admin/manage-ranks/services/rankService"

export const ManageRankPage = () => {
  const navigate = useNavigate()
  const [ranks, setRanks] = useState<Rank[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)

  useEffect(() => {
    const fetch = async () => {
      const res = await getAllRanks(page + 1, 10)
      setRanks(res.items)
      setPageCount(res.totalPages)
    }
    fetch()
  }, [page])

  const handleEdit = (rank: Rank) => {
    navigate(ROUTERS.ADMIN.rank.edit(rank.id))
  }
  const handleShow = (rank: Rank) => {
    navigate(ROUTERS.ADMIN.rank.show(rank.id))
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
        Ranks Management
      </h2>
      <Button onClick={() => navigate(ROUTERS.ADMIN.rank.create)}>
        Create Rank
      </Button>
      </div>
      <RankTable
        data={ranks}
        onEdit={handleEdit}
        onShow={handleShow}
        /* onDelete={handleDelete} */
        pagination={{
          pageIndex: page,
          pageCount: pageCount,
          onPageChange: setPage,
        }}
      />
    </div>
  )
}
