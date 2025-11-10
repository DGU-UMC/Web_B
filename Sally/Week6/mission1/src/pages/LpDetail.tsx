import { useParams } from "react-router-dom";

const LpDetail = () => {
  const { id } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">LP Detail Page</h1>
      <p>LP ID: {id}</p>
    </div>
  );
};

export default LpDetail;
