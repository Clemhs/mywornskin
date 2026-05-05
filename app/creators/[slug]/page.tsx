'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import StoryCard from '@/components/StoryCard';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CreatorProfile() {
  const params = useParams();
  const router = useRouter();
  let slug = (params.slug as string).toLowerCase();   // ← Force minuscule

  const { user } = useAuth();
  const supabase = createClient();

  const [creator, setCreator] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirection si "me"
  useEffect(() => {
    if (params.slug === 'me' && user) {
      const username = (user.user_metadata?.username || user.email?.split('@')[0] || '').toLowerCase();
      if (username) router.replace(`/creators/${username}`);
    }
  }, [params.slug, user, router]);

  const fetchCreatorData = async () => {
    if (!slug) return;

    try {
      const { data: creatorData } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', slug)        // Recherche en minuscule
        .single();

      if (!creatorData) {
        setError('Créatrice non trouvée');
        setLoading(false);
        return;
      }

      setCreator(creatorData);

      // Produits
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('creator_id', creatorData.id)
        .order('created_at', { ascending: false });
      setProducts(productsData || []);

      // Avis
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('creator_id', creatorData.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(5);
      setApprovedReviews(reviewsData || []);

    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchCreatorData();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-zinc-950 pt-32 text-center text-white">Chargement...</div>;
  if (error || !creator) return <div className="min-h-screen bg-zinc-950 pt-32 text-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Un seul Header */}
      <Header />

      {/* Bannière */}
      <div className="h-80 relative">
        <img 
          src={creator.banner_url || "https://picsum.photos/id/1015/1200/400"} 
          alt="Bannière" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/70 to-zinc-950" />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="relative -mt-12 md:-mt-20 flex-shrink-0">
            <img 
              src={creator.avatar_url || "https://picsum.photos/id/64/300/300"} 
              alt={creator.username} 
              className="w-40 h-40 rounded-3xl border-4 border-zinc-950 object-cover" 
            />
          </div>

          <div className="pt-6 flex-1">
            <h1 className="text-4xl font-bold">{creator.full_name}</h1>
            <p className="text-rose-400 text-xl">@{creator.username}</p>
            <p className="text-zinc-400 mt-4 leading-relaxed">
              {creator.bio || "Passionnée de lingerie portée et d'histoires intimes."}
            </p>
          </div>
        </div>

        {/* Boutique et Avis (comme avant) */}
        <div className="mt-16">
          <h2 className="text-3xl font-light mb-8">Sa boutique ({products.length} pièces)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map(p => <StoryCard key={p.id} {...p} creator={creator.username} creatorSlug={slug} />)
            ) : (
              <p className="text-zinc-500 col-span-full">Aucune pièce mise en ligne pour le moment.</p>
            )}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-light mb-8">Avis clients ({approvedReviews.length})</h2>
          {approvedReviews.length > 0 ? (
            <div className="space-y-6">
              {approvedReviews.map(review => (
                <div key={review.id} className="bg-zinc-900 rounded-2xl p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                  </div>
                  <p className="italic text-zinc-300">"{review.comment}"</p>
                  <p className="text-xs text-zinc-500 mt-4">- {review.reviewer_name || 'Client anonyme'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 italic">Aucun avis approuvé pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
