'use client';
// Debug Pending - Version ultra-simple pour voir exactement ce qu’il y a dans la base
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function PendingDebug() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setData(data || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Pending - Toutes les données</h1>
        
        {loading && <p>Chargement...</p>}

        <pre className="bg-zinc-900 p-6 rounded-3xl overflow-auto text-sm max-h-[70vh]">
          {JSON.stringify(data, null, 2)}
        </pre>

        <p className="mt-4 text-zinc-400">
          Nombre de créateurs trouvés : <span className="font-mono text-pink-400">{data.length}</span>
        </p>
      </div>
    </div>
  );
}
