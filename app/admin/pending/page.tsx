'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPending() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      const { data, error } = await supabase
        .from('creators')
        .select('id, username, avatar_url, banner_url, pending_avatar_url, pending_banner_url')
        .limit(20);

      console.log('Toutes les données récupérées :', data);
      console.log('Erreur :', error);

      setItems(data || []);
      setLoading(false);
    };
    loadAll();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Pending - Tous les créateurs</h1>
        <p className="text-zinc-400 mb-8">Nombre total de créateurs trouvés : {items.length}</p>

        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="bg-zinc-900 p-6 rounded-3xl">
              <p className="font-semibold">ID : {item.id} — {item.username}</p>
              <p className="text-sm text-zinc-400 mt-2">
                pending_avatar_url : {item.pending_avatar_url ? '✅ REMPLI' : 'vide'}
              </p>
              <p className="text-sm text-zinc-400">
                pending_banner_url : {item.pending_banner_url ? '✅ REMPLI' : 'vide'}
              </p>
              {item.pending_avatar_url && <img src={item.pending_avatar_url} className="mt-4 rounded-2xl w-32" />}
              {item.pending_banner_url && <img src={item.pending_banner_url} className="mt-4 rounded-2xl w-64" />}
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-zinc-400 text-center py-20">Aucun créateur trouvé dans la table.</p>
        )}
      </div>
    </div>
  );
}
