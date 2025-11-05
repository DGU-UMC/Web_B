import { useParams } from "react-router-dom";

export default function LpDetailPage() {
    const { lpid } = useParams();
    return (
        <div className='p-6'>
            <h1 className='text-xl font-bold'>LP 상세</h1>
            <p className='mt-2 text-gray-700'>id: { lpid }</p>
            {/* 상세 */}
        </div>
    );
};