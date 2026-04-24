'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPending() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('creators')
        .select('*');   // on prend tout pour voir ce qu'il y a vraiment

      console.log('✅ Toutes les données de creators :', data);
      console.log('❌ Erreur :', error);

      setItems(data || []);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Debug Pending - Toutes les données</h1>
      <p className="mb-8">Nombre de créateurs trouvés : <span className="font-mono text-rose-400">{items.length}</span></p>

      <pre className="bg-zinc-900 p-6 rounded-3xl text-sm overflow-auto whitespace-pre-wrap">
        {JSON.stringify(items, null, 2)}
      </pre>
    </div>
  );
}
