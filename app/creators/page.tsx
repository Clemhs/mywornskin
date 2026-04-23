'use client';

// === V12 - TEST ULTIME - SI TU VOIS CE TEXTE ROUGE EN HAUT → NOUVEAU CODE CHARGÉ ===

import Link from 'next/link';
import { useState, useMemo } from 'react';

export const dynamic = 'force-dynamic';

export default function Creators() {
  const [filter, setFilter] = useState<'all' | 'verified' | 'new'>('all');
  const [search, setSearch] = useState('');

  const creators = [
    { id: 1, username: "Lila Noir", avatar: "https://picsum.photos/id/1011/280/280", banner: "https://picsum.photos/id/1005/800/320", verified: true, new: true, price: 49, bio: "Vêtements portés avec passion • Odeur garantie", badge: 10, frame: null },
    { id: 2, username: "Velvet Muse", avatar: "https://picsum.photos/id/1009/280/280", banner: "https://picsum.photos/id/1014/800/320", verified: true, new: false, price: 39, bio: "Sensualité en édition limitée", badge: 100, frame: null },
    { id: 3, username: "Sienna Rose", avatar: "https://picsum.photos/id/1006/280/280", banner: "https://picsum.photos/id/203/800/320", verified: false, new: true, price: 55, bio: "Chaque pièce raconte une histoire", badge: null, frame: "bronze" },
    { id: 4, username: "Nova Lune", avatar: "https://picsum.photos/id/1012/280/280", banner: "https://picsum.photos/id/160/800/320", verified: true, new: false, price: 65, bio: "Nuits intenses • Souvenirs à emporter", badge: 100, frame: "silver" },
    { id: 5, username: "Luna Velvet", avatar: "https://picsum.photos/id/1001/280/280", banner: "https://picsum.photos/id/201/800/320", verified: false, new: true, price: 45, bio: "Douceur et mystère", badge: null, frame: null },
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
      {/* BANDEAU ROUGE TRÈS VISIBLE POUR TESTER LE CACHE */}
      <div className="bg-red-600 text-white text-center py-6 text-2xl font-bold">
        V12 - TEST CACHE - SI TU VOIS CE TEXTE ROUGE → LE NOUVEAU CODE EST CHARGÉ
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        <h1 className="text-4xl font-semibold mb-2">Découvrir les créatrices</h1>
        <p className="text-zinc-400 mb-8">Des femmes qui partagent leur intimité</p>

        {/* Le reste du code est identique à la version précédente pour ne pas alourdir */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input type="text" placeholder="Rechercher une créatrice..." value={search} onChange={(e) => setSearch(e.target.value)} className="input flex-1" />
          <div className="flex gap-2">
            <button onClick={() => setFilter('all')} className={`btn-secondary px-6 py-3 ${filter === 'all' ? 'bg-zinc-800' : ''}`}>Toutes</button>
            <button onClick={() => setFilter('verified')} className={`btn-secondary px-6 py-3 ${filter === 'verified' ? 'bg-zinc-800' : ''}`}>✅ Vérifiées</button>
            <button onClick={() => setFilter('new')} className={`btn-secondary px-6 py-3 ${filter === 'new' ? 'bg-zinc-800' : ''}`}>✦ Nouvelles</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCreators.map((creator) => (
            <Link key={creator.id} href={`/creators/${creator.id}`} className="card group overflow-hidden">
              <div className="relative">
                <img src={creator.banner} alt={creator.username} className="w-full h-48 object-cover" />

                {creator.frame && (
                  <div className={`absolute inset-0 border-[14px] rounded-3xl pointer-events-none ${creator.frame === 'bronze' ? 'border-amber-700' : 'border-zinc-300'}`} />
                )}

                <div className="absolute -bottom-8 left-6">
                  <div className="relative">
                    <img src={creator.avatar} alt={creator.username} className="w-20 h-20 rounded-3xl ring-4 ring-zinc-900 object-cover" />
                    {creator.badge && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-br from-rose-200 via-rose-400 to-amber-400 text-zinc-950 text-4xl font-bold w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-zinc-900">
                        {creator.badge}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-14 pb-6 px-6">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-xl">{creator.username}</p>
                  <div className="text-3xl font-semibold text-rose-400">{creator.price}€</div>
                </div>
                <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{creator.bio}</p>

                <button className="btn-primary w-full mt-8 py-4 text-lg font-medium">
                  S’abonner
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
