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

  // Gestion du "me"
  useEffect(() => {
    if (slug === 'me' && user) {
      const username = user.user_metadata?.username || user.email?.split('@')[0] || 'creator_test';
      router.replace(`/creators/${username}`);
    }
  }, [slug, user, router]);

  // Chargement du profil
  useEffect(() => {
    if (!slug || slug === 'me') return;

    const fetchCreator = async () => {
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
      } else {
        setCreator(data);
      }
      setLoading(false);
    };

    fetchCreator();
  }, [slug, supabase]);

  if (loading) return <div className="min-h-screen bg-zinc-950 text-white pt-20 flex items-center justify-center">Chargement du profil...</div>;
  if (error || !creator) return <div className="min-h-screen bg-zinc-950 text-white pt-20 text-center text-red-400">{error || 'Créatrice non trouvée'}</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <div className="pt-20 max-w-5xl mx-auto px-6">
        <div className="h-80 bg-zinc-900 rounded-3xl relative overflow-hidden mb-8">
          {/* Bannière à venir */}
        </div>

        <div className="flex gap-8">
          {/* Photo de profil + infos */}
          <div className="w-64">
            <img 
              src={creator.avatar_url || "https://picsum.photos/id/64/300/300"} 
              alt={creator.full_name}
              className="w-64 h-64 object-cover rounded-3xl border-4 border-zinc-800"
            />
            <h1 className="text-3xl font-bold mt-6">{creator.full_name}</h1>
            <p className="text-zinc-400">@{creator.username}</p>
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            <p className="text-zinc-300 text-lg">{creator.bio || "Aucune bio pour le moment."}</p>
            {/* Tu pourras ajouter ici les produits, avis, badges, etc. plus tard */}
          </div>
        </div>
      </div>
    </div>
  );
}
