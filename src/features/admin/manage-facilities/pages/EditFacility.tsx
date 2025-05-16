import { useParams } from "react-router-dom"

export const EditFacilityPage = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1>Edit Facility</h1>
      <p>Editing Facility with ID: {id}</p>
    </div>
  )
}
