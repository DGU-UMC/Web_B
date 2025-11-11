import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";

const LpDetailPage = () => {
  const { lpid } = useParams();

  const { data, isPending, isError } = useGetLpDetail(lpid);

  if (isPending) {
    return <div className="mt-15">Loading...</div>;
  }

  if (isError) {
    return <div className="mt-15">Error!</div>;
  }
  return (
    <div>
      <img src={data.thumnail} alt={`${data.title}의 썸네일`} />
      <h1>{data.title}</h1>
      <p>{data.createdAt.slice(0, 10)}</p>
      <p>{data.content}</p>
    </div>
  );
};

export default LpDetailPage;
