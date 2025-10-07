import axios from "axios";
import { useEffect, useState } from "react";

function useCustomFetch<T>(inputUrl: string) {
  const [apiData, setApiData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovies = async (url: string, options: object) => {
      setIsPending(true); // 로딩 시작

      try {
        // const { data } = await axios(url, options);
        const { data } = await axios.get<T>(url, options); // GET 요청임을 명시
        setApiData(data);
      } catch {
        setIsError(true); // 에러 발생
      } finally {
        setIsPending(false); // 로딩 끝
      }
    };

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
      },
    };

    fetchMovies(inputUrl, options);
  }, [inputUrl]);

  return { apiData, isPending, isError };
}

export default useCustomFetch;
