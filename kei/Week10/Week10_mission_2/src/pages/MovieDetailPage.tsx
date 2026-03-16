import { useParams } from "react-router-dom"

export default function MovieDetailPage () {
    const {id} = useParams<{ id: string }>();

    console.log(id);

    return (
        <div className='flex flex-col justify-center items-center m-5 gap-2'>
            영화 상세 페이지입니다. 
            <h1 className=''>김하림/케이</h1>
            <h2>{id}번 상세 페이지를 패칭해옵니다.</h2>
        </div>
    )
}