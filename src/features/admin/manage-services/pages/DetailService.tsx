import { useParams } from "react-router-dom"


export const DetailServicePage = () => {
    const { id } = useParams<{ id: string }>()
    return (
        <div>Detail for {id} </div>
    )
}
