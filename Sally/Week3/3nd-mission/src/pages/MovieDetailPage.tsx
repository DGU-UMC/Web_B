import { useParams } from "react-router-dom";

export const MovieDetailPage = () => {
  const params = useParams();

  return <div>Movie Detail{params.movieid}</div>;
};
