import { useState } from "react";
import { toast } from "sonner";

type ResponseDataType = {
    success: string
}

export const useFetch =  (cb: (...args: any[]) => any) => {
    const [data, setData] = useState<ResponseDataType | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    async function fn(...args: any[]) {
        setLoading(true);
        setError(null);
        try {
            const res = await cb(...args);  //cb is the server action that we're using for fetching/updating data
            setData(res);
        } catch (error) {
            if(error instanceof Error) {
                setError(error);
                toast.error(error.message);
            }
        }
        finally {
            setLoading(false);
        }
    }

    return { data, loading, error, fn, setData };
}
