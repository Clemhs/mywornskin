'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Star } from 'lucide-react';
import CreatorAvatarWithFrame from '@/components/CreatorAvatarWithFrame';

const mockCreators = [
  {
    id: "1",
    username: "creator_test",
    full_name: "Creator Test",
    avatar_url: "https://picsum.photos/id/64/300/300",
    banner_url: "https://picsum.photos/id/201/800/400",
    sales_badge: 10,
    frame: "rose",
    bio: "Passionnée de lingerie portée et d'histoires intimes.",
    country: "France",
    city: "Poitiers",
    size: "XL",
    shoe_size: "38"
  }
];

export default function CreatorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter] = useState<'all' | 'top' | 'new'>('all');

  const filteredCreators = mockCreators; // Pas de filtre pour le test

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">Nos Créatrices</h1>
        <p className="text-center text-zinc-400 text-lg sm:text-xl mb-10">
          Elles partagent leur intimité avec vous • {filteredCreators.length} créatrices
        </p>

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

              <div className="p-5 pt-14 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold">{creator.full_name}</h3>
                <p className="text-rose-400 text-sm">@{creator.username}</p>

                <p className="text-zinc-400 text-sm mt-3 line-clamp-3 flex-1">
                  {creator.bio}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">4.9</span>
                  </div>
                  <span className="text-zinc-500">
                    {creator.sales_badge} ventes
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
