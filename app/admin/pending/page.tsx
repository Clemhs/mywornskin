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
        .select('id, username, pending_avatar_url, pending_banner_url, avatar_url, banner_url');

      console.log('Données récupérées :', data);
      console.log('Erreur :', error);

      setItems(data || []);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Pending</h1>
        <p className="text-zinc-400 mb-8">Nombre de créateurs trouvés : {items.length}</p>

        <pre className="bg-zinc-900 p-6 rounded-3xl text-sm overflow-auto max-h-screen">
          {JSON.stringify(items, null, 2)}
        </pre>
      </div>
    </div>
  );
}
