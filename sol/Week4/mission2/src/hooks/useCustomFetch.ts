import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";

export function useCustomFetch<T>(
  url: string | null,
  config?: AxiosRequestConfig
): {
  data: T | null;
  isPending: boolean;
  isError: boolean;
} {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!url) {
      setData(null);
      setIsPending(false);
      setIsError(false);
      return;
    }
    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        const defualtHeaders = {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
        };
        const response = await axios.get<T>(url, {
          headers: { ...defualtHeaders, ...config?.headers },
          ...config,
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsError(true);
        setData(null);
      } finally {
        setIsPending(false);
      }
    };
    fetchData();
  }, [url, JSON.stringify(config)]);
  return { data, isPending, isError };
}
