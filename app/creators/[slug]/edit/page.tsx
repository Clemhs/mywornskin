'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CreatorEditPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    if (!user) return;

    const loadReviews = async () => {
      console.log("Chargement des reviews pour user:", user.id);

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('creator_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      console.log("Résultat de la requête:", { data, error });

      if (error) {
        setDebugInfo("Erreur: " + error.message);
      } else {
        setPendingReviews(data || []);
        setDebugInfo(`Trouvé ${data?.length || 0} commentaires en attente`);
      }
    };

    loadReviews();
  }, [user]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Debug Commentaires</h1>
      
      <div className="bg-zinc-900 p-6 rounded-2xl mb-8">
        <p className="text-pink-400 font-medium">Debug Info :</p>
        <p>{debugInfo}</p>
        <p className="text-xs text-zinc-500 mt-2">User ID : {user?.id}</p>
      </div>

      <div>
        <h2 className="text-xl mb-4">Commentaires en attente ({pendingReviews.length})</h2>
        {pendingReviews.length === 0 ? (
          <p className="text-zinc-500">Aucun commentaire trouvé.</p>
        ) : (
          pendingReviews.map(r => (
            <div key={r.id} className="bg-zinc-900 p-6 rounded-2xl mb-4">
              <p>"{r.comment}"</p>
              <p className="text-sm text-zinc-500 mt-2">- {r.reviewer_name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
