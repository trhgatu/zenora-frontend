import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table";
import { getAllFacilities } from "@/features/admin/manage-facilities/services/facilityServices";


export default function ManageFacilityPage() {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await getAllFacilities();
        setFacilities(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <DataTable data={facilities} />
          )}
        </div>
      </div>
    </div>
  )
}
