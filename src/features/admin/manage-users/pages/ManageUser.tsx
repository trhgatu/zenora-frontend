import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { getAllUsers } from "@/features/admin/manage-users/services/userServices"


export default function ManageUserPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <DataTable data={users} />
          )}
        </div>
      </div>
    </div>
  )
}