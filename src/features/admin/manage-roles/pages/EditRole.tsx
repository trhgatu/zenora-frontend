import { useParams } from "react-router-dom"

export const EditRolePage = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1>Edit Role</h1>
      <p>Editing role with ID: {id}</p>
    </div>
  )
}
