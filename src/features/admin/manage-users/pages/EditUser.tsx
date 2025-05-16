import { useParams } from "react-router-dom"

export const EditUserPage = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1>Edit user</h1>
      <p>Editing user with ID: {id}</p>
    </div>
  )
}
