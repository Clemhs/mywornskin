'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';
import Header from '@/components/Header';
import { Save, Lock, Camera } from 'lucide-react'; // si tu veux des icônes

export default function CreatorProfile() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user } = useAuth();
  const supabase = createClient();

  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug === 'me' && user) {
      router.replace(`/creators/${user.user_metadata?.username || 'creator_test'}`);
      return;
    }

    const fetchCreator = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', slug)
        .single();

      setCreator(data);
      setLoading(false);
    };

    fetchCreator();
  }, [slug, user, router, supabase]);

  if (loading) return <div className="min-h-screen bg-zinc-950 pt-32 text-center">Chargement...</div>;
  if (!creator) return <div className="min-h-screen bg-zinc-950 pt-32 text-center text-red-400">Créatrice non trouvée</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <div className="pt-20 max-w-6xl mx-auto px-6">
        {/* Bannière */}
        <div className="h-80 bg-gradient-to-r from-rose-950 to-zinc-900 rounded-3xl relative overflow-hidden mb-12">
          {creator.banner_url && <img src={creator.banner_url} className="w-full h-full object-cover" />}
        </div>

        <div className="flex flex-col md:flex-row gap-10 -mt-20">
          {/* Photo profil */}
          <div className="md:w-80 flex-shrink-0 text-center md:text-left">
            <img 
              src={creator.avatar_url || "https://picsum.photos/id/64/400/400"} 
              alt={creator.full_name}
              className="w-56 h-56 mx-auto md:mx-0 object-cover rounded-3xl border-4 border-zinc-950 shadow-2xl"
            />
            <h1 className="text-4xl font-bold mt-6">{creator.full_name}</h1>
            <p className="text-2xl text-rose-400">@{creator.username}</p>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 pt-8">
            <p className="text-zinc-300 text-lg leading-relaxed">
              {creator.bio || "Aucune biographie pour le moment."}
            </p>

            {/* On remettra ici les badges, cadres, commentaires, produits... */}
            <div className="mt-12 text-rose-400 text-sm">
              Badges, cadres et avis seront ajoutés dans les prochaines étapes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
