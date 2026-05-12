'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, ShoppingCart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';
import StoryCard from '@/components/StoryCard';

export default function FavoritesPage() {
  const router = useRouter();
  const { user, isCreator } = useAuth();
  const supabase = createClient();

  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirection si pas client
  useEffect(() => {
    if (isCreator) router.push('/creators/me');
  }, [isCreator, router]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          product:products (
            *,
            creator:profiles!creator_id (username, full_name, avatar_url)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setFavorites(data || []);

      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  const removeFavorite = async (productId: string) => {
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user?.id)
      .eq('product_id', productId);

    setFavorites(prev => prev.filter(f => f.product_id !== productId));
  };

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center">Chargement de vos favoris...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => router.back()} className="text-zinc-400 hover:text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-4xl font-light flex items-center gap-3">
            <Heart className="text-rose-500" /> Mes Favoris
          </h1>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-zinc-900 rounded-3xl p-16 text-center">
            <Heart className="w-20 h-20 text-zinc-600 mx-auto mb-6" />
            <p className="text-2xl text-zinc-400">Vous n'avez pas encore de favoris</p>
            <p className="text-zinc-500 mt-3">Les articles que vous aimez apparaîtront ici</p>
            <button
              onClick={() => router.push('/shop')}
              className="mt-8 px-8 py-4 bg-rose-500 hover:bg-rose-600 rounded-2xl font-medium"
            >
              Découvrir la boutique
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((fav) => (
              <div key={fav.id} className="relative group">
                <StoryCard
                  {...fav.product}
                  creator={fav.product.creator?.full_name}
                  creatorSlug={fav.product.creator?.username}
                />
                <button
                  onClick={() => removeFavorite(fav.product_id)}
                  className="absolute top-4 right-4 bg-black/70 hover:bg-red-600 p-2.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
                >
                  <Heart className="w-5 h-5 fill-current text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
