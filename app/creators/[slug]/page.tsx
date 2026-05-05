'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function CreatorProfile() {
  const params = useParams();
  const slug = params.slug as string;

  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      console.log("🔍 Chargement du slug :", slug);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', slug)
        .single();

      console.log("📊 Résultat :", { data, error });

      if (error || !data) {
        setError('Créatrice non trouvée');
      } else {
        setCreator(data);
      }
      setLoading(false);
    };

    load();
  }, [slug]);

  if (loading) return <div className="pt-32 text-center text-white">Chargement...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-4xl mb-8">Profil Créatrice</h1>
      
      {creator ? (
        <div>
          <h2 className="text-3xl">✅ Trouvé : {creator.full_name}</h2>
          <p className="text-2xl text-green-400">@{creator.username}</p>
          <pre className="mt-8 bg-zinc-900 p-6 rounded-2xl text-sm">
            {JSON.stringify(creator, null, 2)}
          </pre>
        </div>
      ) : (
        <p className="text-red-400 text-xl">{error}</p>
      )}
    </div>
  );
}
