'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import CreatorAvatarWithFrame from '@/components/CreatorAvatarWithFrame';
import { createClient } from '@/lib/supabase/client';

export default function CreatorsPage() {
  const supabase = createClient();

  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'top' | 'new'>('all');

  useEffect(() => {
    const fetchCreators = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, banner_url, sales_badge, frame, bio')
        .eq('role', 'creator')
        .order('sales_badge', { ascending: false });

      if (error) console.error(error);
      else setCreators(data || []);

      setLoading(false);
    };

    fetchCreators();
  }, [supabase]);

  const filteredCreators = creators.filter(creator => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'top') return (creator.sales_badge || 0) >= 10;
    return true;
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">Nos Créatrices</h1>
        <p className="text-center text-zinc-400 text-lg sm:text-xl mb-10">
          Elles partagent leur intimité avec vous • {filteredCreators.length} créatrices
        </p>

        {/* Filtres style Boutique */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4">
            {[
              { label: 'Tout', value: 'all' },
              { label: 'Top Ventes', value: 'top' },
              { label: 'Nouvelles', value: 'new' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value as any)}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeFilter === filter.value 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-zinc-400 py-20">Chargement des créatrices...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {filteredCreators.map((creator) => (
              <Link
                key={creator.username}
                href={`/creators/${creator.username}`}
                className="group bg-zinc-900 rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300 flex flex-col"
              >
                <CreatorAvatarWithFrame
                  avatarUrl={creator.avatar_url}
                  bannerUrl={creator.banner_url}
                  salesBadge={creator.sales_badge}
                  frame={creator.frame}
                />

                <div className="p-5 pt-14 flex-1 flex flex-col">   {/* pt-14 pour laisser de la place à l'avatar qui dépasse */}
                  <h3 className="text-xl font-semibold">{creator.full_name}</h3>
                  <p className="text-rose-400 text-sm">@{creator.username}</p>

                  <p className="text-zinc-400 text-sm mt-3 line-clamp-3 flex-1">
                    {creator.bio || "Passionnée de lingerie portée et d'histoires intimes."}
                  </p>

                  <div className="mt-auto pt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">4.9</span>
                    </div>
                    <span className="text-zinc-500">
                      {creator.sales_badge ? `${creator.sales_badge} ventes` : 'Nouvelle'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
