import { useParams } from "react-router-dom"

export const EditCategoryPage = () => {
    const { id } = useParams();
    return (
        <>
            Edit {id}
        </>
    )
}