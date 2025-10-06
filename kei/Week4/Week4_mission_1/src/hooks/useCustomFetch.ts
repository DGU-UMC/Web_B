import { useState, useEffect } from 'react';
import axios from 'axios';

interface ApiResponse<T> {
    data: T | null;
    isPending: boolean;
    isError: boolean;
}

function useCustomFetch<T>(url: string) : ApiResponse<T> {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const TOKEN = import.meta.env.VITE_TMDB_KEY;
        const headers = {Authorization: `Bearer ${TOKEN}`, accept: 'application/json'};

        const fetchData = async() => {
            setIsPending(true);
            
            try {
                const { data } = await axios.get<T>(url, { headers });
                setData(data);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        } 

        fetchData();
    }, [url]);

    return { data, isPending, isError };
}

export default useCustomFetch;