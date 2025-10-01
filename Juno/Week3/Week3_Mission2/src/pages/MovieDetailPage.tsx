import { useParams } from "react-router-dom";

function MovieDetailPage() {
  const { movieId } = useParams();

  return <div>{movieId}의 상세 페이지</div>;
}

export default MovieDetailPage;
