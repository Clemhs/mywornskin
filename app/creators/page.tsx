'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Star, Award } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function CreatorsPage() {
  const supabase = createClient();

  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, sales_badge, frame, bio')
        .eq('role', 'creator')           // Si tu as une colonne role
        .order('sales_badge', { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setCreators(data || []);
      }
      setLoading(false);
    };

    fetchCreators();
  }, [supabase]);

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 pt-32 text-center">Chargement des créatrices...</div>;
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-28">
        <h1 className="text-5xl font-bold text-center mb-4">Nos Créatrices</h1>
        <p className="text-center text-zinc-400 text-xl mb-16">
          Elles partagent leur intimité avec vous
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {creators.map((creator) => (
            <Link
              key={creator.username}
              href={`/creators/${creator.username}`}
              className="group bg-zinc-900 rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={creator.avatar_url || "https://picsum.photos/id/64/300/300"}
                  alt={creator.full_name}
                  className="w-full h-80 object-cover"
                />

                {/* Cadre animé + Badge de ventes */}
                <div className="absolute bottom-6 left-6">
                  <div className="relative inline-block">
                    <img
                      src={creator.avatar_url || "https://picsum.photos/id/64/300/300"}
                      alt={creator.full_name}
                      className="w-24 h-24 rounded-2xl border-4 border-zinc-950 object-cover"
                    />

                    {creator.frame && (
                      <div className={`absolute inset-0 rounded-2xl border-4 shimmer-frame ${creator.frame}`} />
                    )}

                    {creator.sales_badge && (
                      <img
                        src={`/badges/${creator.sales_badge}.png`}
                        alt={`Badge ${creator.sales_badge}`}
                        className="absolute -top-3 -right-3 w-12 h-12 drop-shadow-xl"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-2xl font-semibold">{creator.full_name}</h2>
                <p className="text-rose-400">@{creator.username}</p>
                <p className="text-zinc-400 mt-3 line-clamp-2">
                  {creator.bio || "Passionnée de lingerie portée et d'histoires intimes."}
                </p>

                <div className="flex items-center gap-2 mt-6">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">4.9</span>
                  <span className="text-zinc-500">
                    • {creator.sales_badge ? `${creator.sales_badge}+ ventes` : 'Nouvelle'}
                  </span>
                </div>

                {creator.sales_badge && (
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-800 rounded-2xl text-sm">
                      <Award className="w-4 h-4 text-rose-400" />
                      Badge {creator.sales_badge} ventes
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Styles shimmer (déjà dans globals.css) */}
    </main>
  );
}
