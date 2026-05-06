'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import StoryCard from '@/components/StoryCard';
import { createClient } from '@/lib/supabase/client';

export default function CreatorProfile() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params.slug as string;
  const slug = rawSlug.toLowerCase();

  const supabase = createClient();

  const [creator, setCreator] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirection si majuscule ou "me"
  useEffect(() => {
    if (rawSlug !== slug) {
      router.replace(`/creators/${slug}`);
    }
    if (rawSlug === 'me') {
      router.replace('/creators/creator_test'); // À remplacer par logique utilisateur plus tard
    }
  }, [rawSlug, slug, router]);

  const fetchCreatorData = async () => {
    if (!slug) return;

    try {
      const { data: creatorData } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', slug)
        .single();

      if (!creatorData) {
        setError('Créatrice non trouvée');
        setLoading(false);
        return;
      }

      setCreator(creatorData);

      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('creator_id', creatorData.id);

      setProducts(productsData || []);

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('creator_id', creatorData.id)
        .eq('status', 'approved')
        .limit(5);

      setApprovedReviews(reviewsData || []);
    } catch (err) {
      setError('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatorData();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-zinc-950 pt-32 text-center">Chargement...</div>;
  if (error || !creator) return <div className="min-h-screen bg-zinc-950 pt-32 text-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
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
          {/* AVATAR AVEC BADGE + CADRE */}
          <div className="relative -mt-12 md:-mt-20 flex-shrink-0">
            <div className="relative inline-block">
              <img 
                src={creator.avatar_url || "https://picsum.photos/id/64/300/300"} 
                alt={creator.username} 
                className="w-40 h-40 rounded-3xl border-4 border-zinc-950 object-cover" 
              />

              {/* Cadre animé */}
              {creator.frame && (
                <div className={`absolute inset-0 rounded-3xl border-4 shimmer-frame ${creator.frame}`} />
              )}

              {/* Badge de ventes */}
              {creator.sales_badge && (
                <img 
                  src={`/badges/${creator.sales_badge}.png`} 
                  alt={`Badge ${creator.sales_badge} ventes`}
                  className="absolute -top-4 -right-4 w-16 h-16 drop-shadow-2xl" 
                />
              )}
            </div>
          </div>

          <div className="pt-6 flex-1">
            <h1 className="text-4xl font-bold">{creator.full_name}</h1>
            <p className="text-rose-400 text-xl">@{creator.username}</p>
            <p className="text-zinc-400 mt-4 leading-relaxed">
              {creator.bio || "Passionnée de lingerie portée et d'histoires intimes."}
            </p>
          </div>
        </div>

        {/* Boutique */}
        <div className="mt-16">
          <h2 className="text-3xl font-light mb-8">Sa boutique ({products.length} pièces)</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(p => (
                <StoryCard 
                  key={p.id} 
                  {...p} 
                  creator={creator.username} 
                  creatorSlug={slug} 
                />
              ))}
            </div>
          ) : (
            <p className="text-zinc-500">Aucune pièce mise en ligne pour le moment.</p>
          )}
        </div>

        {/* Avis */}
        <div className="mt-16">
          <h2 className="text-3xl font-light mb-8">Avis clients ({approvedReviews.length})</h2>
          {approvedReviews.length > 0 ? (
            <div className="space-y-6">
              {approvedReviews.map(review => (
                <div key={review.id} className="bg-zinc-900 rounded-2xl p-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="italic text-zinc-300">"{review.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 italic">Aucun avis approuvé pour le moment.</p>
          )}
        </div>
      </div>

      {/* Styles shimmer */}
      <style jsx global>{`
        @keyframes shimmer-frame {
          0% { background-position: -200% 0; }
          100% { background-position: 300% 0; }
        }
        .shimmer-frame {
          animation: shimmer-frame 8s linear infinite;
          background: linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%);
          background-size: 200% 100%;
        }
        .shimmer-frame.rose { border-color: #f472b6; box-shadow: 0 0 40px #f472b6; }
        .shimmer-frame.silver { border-color: #e2e8f0; box-shadow: 0 0 40px #e2e8f0; }
        .shimmer-frame.gold { border-color: #fbbf24; box-shadow: 0 0 45px #fbbf24; }
      `}</style>
    </div>
  );
}
