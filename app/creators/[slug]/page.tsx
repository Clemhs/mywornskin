'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';
import Header from '@/components/Header';

export default function CreatorProfile() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user } = useAuth();
  const supabase = createClient();

  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Gestion du slug "me"
  useEffect(() => {
    if (slug === 'me' && user) {
      const username = user.user_metadata?.username || 'creator_test';
      router.replace(`/creators/${username}`);
    }
  }, [slug, user, router]);

  // Chargement du profil
  useEffect(() => {
    if (!slug || slug === 'me') return;

    const fetchCreator = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            creators(*)
          `)
          .eq('username', slug)
          .single();

        if (error || !data) {
          setError('Créatrice non trouvée');
          console.error('Erreur fetch:', error);
        } else {
          setCreator(data);
        }
      } catch (err) {
        setError('Erreur lors du chargement');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [slug, supabase]);

  if (loading) return <div className="min-h-screen bg-zinc-950 text-white pt-20 text-center">Chargement...</div>;
  if (error) return <div className="min-h-screen bg-zinc-950 text-white pt-20 text-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <div className="pt-20 max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-bold mt-10">Profil de {creator.full_name}</h1>
        <p className="text-zinc-400">@{creator.username}</p>
        {/* Le reste de ton profil (bannière, badges, etc.) */}
        <pre className="mt-10 bg-zinc-900 p-6 rounded-2xl text-sm overflow-auto">
          {JSON.stringify(creator, null, 2)}
        </pre>
      </div>
    </div>
  );
}
