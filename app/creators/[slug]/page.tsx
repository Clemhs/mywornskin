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
      const username = user.user_metadata?.username || 'creator_test';
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

  if (loading) return <div className="min-h-screen bg-zinc-950 text-white pt-20 flex items-center justify-center text-xl">Chargement du profil...</div>;
  if (error || !creator) return <div className="min-h-screen bg-zinc-950 text-white pt-20 text-center text-red-400 text-xl">{error}</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <div className="pt-20 max-w-6xl mx-auto px-6">
        {/* Bannière */}
        <div className="h-80 bg-gradient-to-r from-rose-950 to-zinc-900 rounded-3xl relative overflow-hidden mb-12">
          {creator.banner_url && (
            <img src={creator.banner_url} alt="Bannière" className="w-full h-full object-cover opacity-80" />
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-10 -mt-20">
          {/* Photo de profil */}
          <div className="md:w-80 flex-shrink-0">
            <img 
              src={creator.avatar_url || "https://picsum.photos/id/64/400/400"} 
              alt={creator.full_name}
              className="w-56 h-56 object-cover rounded-3xl border-4 border-zinc-950 shadow-2xl"
            />
            <h1 className="text-4xl font-bold mt-6">{creator.full_name}</h1>
            <p className="text-2xl text-rose-400">@{creator.username}</p>
          </div>

          {/* Infos principales */}
          <div className="flex-1 pt-8">
            <p className="text-zinc-300 text-lg leading-relaxed">
              {creator.bio || "Aucune biographie pour le moment."}
            </p>

            {/* Badges, cadres, produits... à ajouter plus tard */}
            <div className="mt-12 text-zinc-500">
              Section badges, avis et produits à venir...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
