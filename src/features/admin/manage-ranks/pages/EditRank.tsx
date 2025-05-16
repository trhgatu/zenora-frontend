import { useParams } from "react-router-dom"

export const EditRankPage = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1>Edit rank</h1>
      <p>Editing rank with ID: {id}</p>
    </div>
  )
}
