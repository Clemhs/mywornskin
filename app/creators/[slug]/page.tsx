'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';

export default function CreatorProfile() {
  const params = useParams();
  const rawSlug = params.slug as string;
  const slug = rawSlug.toLowerCase();   // Force minuscule

  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from('profiles')
      .select('*')
      .eq('username', slug)
      .single()
      .then(({ data, error }) => {
        console.log(`Recherche "${slug}" →`, data ? 'Trouvé' : 'Non trouvé', error);
        setCreator(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-zinc-950 pt-32 text-center text-white">Chargement...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <div className="pt-20 max-w-5xl mx-auto px-6 text-center">
        {creator ? (
          <div>
            <img 
              src={creator.avatar_url || "https://picsum.photos/id/64/300/300"} 
              alt={creator.full_name}
              className="w-40 h-40 mx-auto rounded-3xl border-4 border-zinc-800 object-cover mb-6"
            />
            <h1 className="text-4xl font-bold">{creator.full_name}</h1>
            <p className="text-2xl text-rose-400">@{creator.username}</p>
            <p className="text-zinc-400 mt-6 max-w-md mx-auto">
              {creator.bio || "Aucune biographie pour le moment."}
            </p>
          </div>
        ) : (
          <p className="text-red-400 text-2xl">Créatrice non trouvée ({rawSlug})</p>
        )}
      </div>
    </div>
  );
}
