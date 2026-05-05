'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function CreatorProfileDebug() {
  const params = useParams();
  const slug = params.slug as string;

  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    const fetchDebug = async () => {
      const supabase = createClient();

      console.log("🔍 Recherche du slug :", slug);

      // Requête brute
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', slug)
        .single();

      console.log("📊 Résultat brut :", { data, error });

      setRawData({ data, error });

      if (error || !data) {
        setError(`Créatrice non trouvée (slug: ${slug})`);
      } else {
        setCreator(data);
      }
      setLoading(false);
    };

    fetchDebug();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-zinc-950 pt-32 text-center text-white">Chargement...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-3xl mb-8">🔍 Debug Profil</h1>
      
      <div className="bg-zinc-900 p-6 rounded-2xl mb-6">
        <p><strong>Slug recherché :</strong> {slug}</p>
        {creator ? (
          <div className="mt-4">
            <p>✅ Trouvé !</p>
            <pre className="mt-4 bg-black p-4 rounded-xl overflow-auto text-sm">
              {JSON.stringify(creator, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-red-400 mt-4">❌ Non trouvé</p>
        )}
      </div>

      {rawData && (
        <div className="bg-zinc-900 p-6 rounded-2xl text-xs">
          <strong>Données brutes de Supabase :</strong>
          <pre className="mt-2 overflow-auto">{JSON.stringify(rawData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
