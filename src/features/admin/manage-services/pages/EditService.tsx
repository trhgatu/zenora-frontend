import { useParams } from "react-router-dom"

export const EditServicePage = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1>Edit service</h1>
      <p>Editing service with ID: {id}</p>
    </div>
  )
}
