'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { useAuth } from '@/app/contexts/AuthContext';
import StoryCard from '@/components/StoryCard';

export default function FavoritesPage() {
  const { user } = useAuth();

  // Hook robuste pour charger les favoris
  const { data: favoritesData = [], loading, error } = useSupabaseQuery<any[]>(async (sb) => {
    if (!user) return { data: [], error: null };

    return sb
      .from('favorites')
      .select(`
        *,
        product:products!product_id (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
  });

  // Sécurité supplémentaire
  const favorites = favoritesData || [];

  const filteredFavorites = useMemo(() => {
    return favorites.filter(fav => fav.product); // Filtre les favoris sans produit
  }, [favorites]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white pt-20 flex items-center justify-center">
        <p className="text-zinc-400">Chargement de vos favoris...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/profile" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft size={20} /> Retour
          </Link>
          <h1 className="text-4xl font-light">Mes Favoris</h1>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-600 text-red-400 p-6 rounded-3xl mb-8">
            Impossible de charger vos favoris
          </div>
        )}

        {filteredFavorites.length === 0 ? (
          <div className="text-center py-32">
            <Heart className="w-16 h-16 mx-auto text-zinc-700 mb-6" />
            <p className="text-xl text-zinc-400">Vous n’avez aucun favori pour le moment</p>
            <Link href="/shop" className="mt-8 inline-block px-8 py-4 bg-rose-500 hover:bg-rose-600 rounded-3xl font-medium">
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredFavorites.map((fav) => {
              const p = fav.product;
              if (!p) return null;

              return (
                <div key={fav.id} className="relative">
                  <StoryCard
                    id={p.id}
                    title={p.title}
                    creator={p.creator?.full_name || 'Créatrice'}
                    creatorSlug={p.creator?.username}
                    price={p.price}
                    image={p.images?.[0] || p.image}
                    hasStory={p.has_story}
                    hasVoice={p.has_voice}
                    wornDays={p.worn_days}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
