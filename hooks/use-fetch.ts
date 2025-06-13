import { useState } from "react";
import { toast } from "sonner";

type ResponseDataType = {
    success: string
}

type ServerActionType = (...args: any[]) => any


const useFetch =  () => {
    const [data, setData] = useState<ResponseDataType | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null | unknown>(null);

    async function fn(cb: ServerActionType, ...args: any[]) { //...args will expect any number of arguments (rest operator), and combine them into an array, so that's why we'll have to destructure the same using spread operator, while passing them as arguments in the server action function calling.
        setLoading(true);
        setError(null);
        try {
            const res = await cb(...args);  //cb is the server action that we're using for fetching/updating data (BE-calls).
            setData(res);
        } catch (error) {
            if(error instanceof Error) {
                setError(error);
                console.log(`error in the use-fetch custom hook - ${error.message}`);
                toast.error(error.message);
            }
            else{
                setError(error);
                console.log(`error in the use-fetch custom hook - ${error}`);
                toast.error("An unknown error occured, please try again later.")
            }
        }
        finally {
            setLoading(false);
        }
    }

    return { data, loading, error, fn, setData };
}

export default useFetch;
