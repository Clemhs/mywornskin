import { createClient } from '@/lib/supabase/server';
import StoryCard from '@/components/StoryCard';
import { notFound } from 'next/navigation';
import { Star, MapPin, Flag } from 'lucide-react';

export default async function CreatorProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cleanSlug = slug.toLowerCase();

  const supabase = await createClient();

  const { data: creator } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', cleanSlug)
    .single();

  if (!creator) notFound();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('creator_id', creator.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('creator_id', creator.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(10);

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
          <div className="relative -mt-12 md:-mt-20 flex-shrink-0">
            <div className="relative inline-block">
              <img 
                src={creator.avatar_url || "https://picsum.photos/id/64/300/300"} 
                alt={creator.username} 
                className="w-40 h-40 rounded-3xl border-4 border-zinc-950 object-cover" 
              />
              
              {/* Shimmer Frame (remplacé par Tailwind + animation) */}
              {creator.frame && (
                <div className={`absolute inset-0 rounded-3xl border-4 animate-shimmer ${creator.frame}`} 
                     style={{
                       background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.9) 50%, transparent 75%)',
                       backgroundSize: '200% 100%'
                     }} 
                />
              )}

              {creator.sales_badge && (
                <img 
                  src={`/badges/${creator.sales_badge}.png`} 
                  alt={`Badge ${creator.sales_badge}`}
                  className="absolute -top-4 -right-4 w-16 h-16 drop-shadow-2xl" 
                />
              )}
            </div>
          </div>

          <div className="pt-6 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold">{creator.full_name}</h1>
                <p className="text-rose-400 text-xl">@{creator.username}</p>
              </div>
              <button className="flex items-center gap-2 text-red-400 hover:text-red-500 transition text-sm mt-2">
                <Flag size={18} /> Signaler
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-zinc-400">
              {(creator.country || creator.city) && (
                <span className="flex items-center gap-1">
                  <MapPin size={16} /> {creator.country} {creator.city && `• ${creator.city}`}
                </span>
              )}
              {creator.size && <span>• Taille {creator.size}</span>}
              {creator.shoe_size && <span>• Pointure {creator.shoe_size}</span>}
            </div>

            <p className="text-zinc-400 mt-5 leading-relaxed">
              {creator.bio || "Passionnée de lingerie portée et d'histoires intimes."}
            </p>
          </div>
        </div>

        {/* Boutique */}
        <div className="mt-16">
          <h2 className="text-3xl font-light mb-8">Sa boutique ({products?.length || 0} pièces)</h2>
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(p => (
                <StoryCard key={p.id} {...p} creator={creator.username} creatorSlug={cleanSlug} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-500">Aucune pièce mise en ligne pour le moment.</p>
          )}
        </div>

        {/* Avis */}
        <div className="mt-16">
          <h2 className="text-3xl font-light mb-8">Avis clients ({reviews?.length || 0})</h2>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map(review => (
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

      {/* Styles globaux pour le shimmer */}
      <style jsx global>{`
        @keyframes shimmer-frame {
          0% { background-position: -200% 0; }
          100% { background-position: 300% 0; }
        }
        .animate-shimmer {
          animation: shimmer-frame 8s linear infinite;
        }
        .shimmer-frame.rose { border-color: #f472b6; box-shadow: inset 0 0 35px #f472b6; }
        .shimmer-frame.silver { border-color: #e2e8f0; box-shadow: inset 0 0 35px #e2e8f0; }
        .shimmer-frame.gold { border-color: #fbbf24; box-shadow: inset 0 0 35px #fbbf24; }
      `}</style>
    </div>
  );
}
