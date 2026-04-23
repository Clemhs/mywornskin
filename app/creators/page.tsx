'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';

export default function Creators() {
  const [filter, setFilter] = useState<'all' | 'verified' | 'new'>('all');
  const [search, setSearch] = useState('');

  const creators = [
    {
      id: 1,
      username: "Lila Noir",
      avatar: "https://picsum.photos/id/64/128/128",
      banner: "https://picsum.photos/id/201/800/300",
      verified: true,
      new: true,
      price: 49,
      bio: "Vêtements portés avec passion • Odeur garantie",
    },
    {
      id: 2,
      username: "Velvet Muse",
      avatar: "https://picsum.photos/id/65/128/128",
      banner: "https://picsum.photos/id/202/800/300",
      verified: true,
      new: false,
      price: 39,
      bio: "Sensualité en édition limitée",
    },
    {
      id: 3,
      username: "Sienna Rose",
      avatar: "https://picsum.photos/id/66/128/128",
      banner: "https://picsum.photos/id/203/800/300",
      verified: false,
      new: true,
      price: 55,
      bio: "Chaque pièce raconte une histoire",
    },
  ];

  const filteredCreators = useMemo(() => {
    return creators.filter(creator => {
      const matchesSearch = creator.username.toLowerCase().includes(search.toLowerCase());
      if (filter === 'verified') return matchesSearch && creator.verified;
      if (filter === 'new') return matchesSearch && creator.new;
      return matchesSearch;
    });
  }, [filter, search]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <h1 className="text-4xl font-semibold mb-2">Découvrir les créatrices</h1>
        <p className="text-zinc-400 mb-8">Des femmes qui partagent leur intimité</p>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Rechercher une créatrice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1"
          />
          <div className="flex gap-2">
            <button onClick={() => setFilter('all')} className={`btn-secondary px-6 py-3 ${filter === 'all' ? 'bg-zinc-800' : ''}`}>Toutes</button>
            <button onClick={() => setFilter('verified')} className={`btn-secondary px-6 py-3 ${filter === 'verified' ? 'bg-zinc-800' : ''}`}>✅ Vérifiées</button>
            <button onClick={() => setFilter('new')} className={`btn-secondary px-6 py-3 ${filter === 'new' ? 'bg-zinc-800' : ''}`}>✦ Nouvelles</button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCreators.map((creator) => (
            <Link key={creator.id} href={`/creators/${creator.id}`} className="card group overflow-hidden">
              <div className="relative">
                <Image src={creator.banner} alt="" width={800} height={300} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 flex gap-2">
                  {creator.verified && <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-2xl font-medium">✓ Vérifiée</span>}
                  {creator.new && <span className="bg-rose-500 text-white text-xs px-3 py-1 rounded-2xl font-medium">✦ Nouvelle</span>}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4">
                  <Image src={creator.avatar} alt="" width={64} height={64} className="rounded-full ring-2 ring-rose-500/30" />
                  <div className="flex-1">
                    <p className="font-semibold text-xl">{creator.username}</p>
                    <p className="text-sm text-zinc-400">{creator.bio}</p>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-semibold text-rose-400">{creator.price}€</span>
                    <span className="text-zinc-400 text-sm"> / pièce</span>
                  </div>
                  <button className="btn-primary px-8 py-4 text-lg font-medium">
                    S’abonner
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
