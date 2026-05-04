'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const supabase = createClient();
  const [refusedReviews, setRefusedReviews] = useState<any[]>([]);
  const [debug, setDebug] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles!inner(username)')
        .eq('status', 'rejected')
        .order('created_at', { ascending: false });

      console.log("Admin - Reviews rejected:", { data, error });

      if (error) setDebug("Erreur: " + error.message);
      else {
        setRefusedReviews(data || []);
        setDebug(`Trouvé ${data?.length || 0} commentaires refusés`);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Debug Admin - Commentaires refusés</h1>
      
      <div className="bg-zinc-900 p-6 rounded-2xl mb-8">
        <p className="text-pink-400 font-medium">Debug :</p>
        <p>{debug}</p>
      </div>

      {refusedReviews.length === 0 ? (
        <p>Aucun commentaire refusé trouvé.</p>
      ) : (
        refusedReviews.map(r => (
          <div key={r.id} className="bg-zinc-900 p-6 rounded-2xl mb-4">
            <p>"{r.comment}"</p>
            <p className="text-sm text-zinc-500">- {r.profiles?.username}</p>
            <p className="text-xs text-zinc-500">Status: {r.status}</p>
          </div>
        ))
      )}
    </div>
  );
}
