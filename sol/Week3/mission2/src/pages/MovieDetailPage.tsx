import { useParams } from "react-router";

const MovieDetailPage = () => {
  const params = useParams();
  return <div>{params.movieId}</div>;
};
export default MovieDetailPage;
