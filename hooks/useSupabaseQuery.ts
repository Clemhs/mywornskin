import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useSupabaseQuery<T>(
  queryFn: (supabase: any) => Promise<{ data: T | null; error: any }>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const result = await queryFn(supabase);
        if (result.error) throw result.error;

        setData(result.data);
        setLoading(false);
        return result.data;
      } catch (err) {
        attempts++;
        if (attempts === maxAttempts) {
          console.error("❌ Échec après", maxAttempts, "tentatives :", err);
          setError(err);
        } else {
          console.warn(`Tentative ${attempts}/${maxAttempts}...`);
          await new Promise(r => setTimeout(r, 700));
        }
      }
    }
    setLoading(false);
  }, [queryFn]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}
