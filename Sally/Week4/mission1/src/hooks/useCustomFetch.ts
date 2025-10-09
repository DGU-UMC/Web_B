import { useState, useEffect } from "react";
import axios from "axios";

export function useCustomFetch<T>(
  url?: string,
  params?: Record<string, string | number>
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const { data } = await axios.get<T>(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
          params,
        });

        setData(data);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, params]);
  return { data, isLoading, isError };
}
