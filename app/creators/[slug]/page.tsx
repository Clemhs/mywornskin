'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';

export default function CreatorProfile() {
  const params = useParams();
  const slug = params.slug as string;

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
        console.log("Résultat :", data, error);
        setCreator(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-zinc-950 pt-32 text-center text-white">Chargement...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <div className="pt-20 max-w-4xl mx-auto px-6 text-center">
        {creator ? (
          <>
            <h1 className="text-5xl font-bold mb-2">✅ {creator.full_name}</h1>
            <p className="text-3xl text-rose-400">@{creator.username}</p>
            <div className="mt-12 bg-zinc-900 rounded-3xl p-8 text-left">
              <pre className="text-sm text-zinc-400 overflow-auto">
                {JSON.stringify(creator, null, 2)}
              </pre>
            </div>
          </>
        ) : (
          <p className="text-red-400 text-2xl">Créatrice non trouvée</p>
        )}
      </div>
    </div>
  );
}
