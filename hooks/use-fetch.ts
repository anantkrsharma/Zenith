"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function useFetch<T>() {
  const [data, setData] = useState<T | null>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = useCallback(
    async <Args extends unknown[]>(
      action: (...args: Args) => Promise<T>,
      ...args: Args
    ) => {
      setLoading(true);
      setError(null);
      setData(undefined);
      try {
        const result = await action(...args);
        setData(result);
        return result;
      } catch (cause) {
        const failure =
          cause instanceof Error
            ? cause
            : new Error("Something went wrong. Please try again.");
        setError(failure);
        toast.error(failure.message);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { data, loading, error, fn, setData };
}
