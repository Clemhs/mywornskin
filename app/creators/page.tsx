'use client';

// V20 - Cadres animés Shimmering Frame (style Steam) - Rose / Argent / Or

import Link from 'next/link';
import { useState, useMemo } from 'react';

export const dynamic = 'force-dynamic';

export default function Creators() {
  const [filter, setFilter] = useState<'all' | 'verified' | 'new'>('all');
  const [search, setSearch] = useState('');

  const creators = [
    { id: 1, username: "Lila Noir", avatar: "https://picsum.photos/id/1011/280/280", banner: "https://picsum.photos/id/1005/800/320", verified: true, new: true, price: 49, bio: "Vêtements portés avec passion • Odeur garantie", badge: 10, frame: null },
    { id: 2, username: "Velvet Muse", avatar: "https://picsum.photos/id/1009/280/280", banner: "https://picsum.photos/id/1014/800/320", verified: true, new: false, price: 39, bio: "Sensualité en édition limitée", badge: 100, frame: null },
    { id: 3, username: "Sienna Rose", avatar: "https://picsum.photos/id/1006/280/280", banner: "https://picsum.photos/id/203/800/320", verified: false, new: true, price: 55, bio: "Chaque pièce raconte une histoire", badge: null, frame: "rose" },
    { id: 4, username: "Nova Lune", avatar: "https://picsum.photos/id/1012/280/280", banner: "https://picsum.photos/id/160/800/320", verified: true, new: false, price: 65, bio: "Nuits intenses • Souvenirs à emporter", badge: 100, frame: "silver" },
    { id: 5, username: "Luna Velvet", avatar: "https://picsum.photos/id/1001/280/280", banner: "https://picsum.photos/id/201/800/320", verified: false, new: true, price: 45, bio: "Douceur et mystère", badge: null, frame: "gold" },
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCreators.map((creator) => (
            <Link key={creator.id} href={`/creators/${creator.id}`} className="card group overflow-hidden">
              <div className="relative">
                <div className={`relative rounded-3xl overflow-hidden ${creator.frame ? 'p-3' : ''}`}>
                  <img 
                    src={creator.banner} 
                    alt={creator.username} 
                    className="w-full h-48 object-cover rounded-3xl" 
                  />

                  {/* Cadre animé Shimmering Frame */}
                  {creator.frame && (
                    <div className={`shimmer-frame absolute inset-0 rounded-3xl pointer-events-none ${creator.frame}`} />
                  )}
                </div>

                {/* Avatar + badge PNG (petit et discret) */}
                <div className="absolute -bottom-8 left-6">
                  <div className="relative">
                    <img 
                      src={creator.avatar} 
                      alt={creator.username} 
                      className="w-20 h-20 rounded-3xl ring-4 ring-zinc-900 object-cover" 
                    />
                    {creator.badge && (
                      <img 
                        src={`/badges/${creator.badge}.png`} 
                        alt="badge" 
                        className="absolute -top-1 -right-1 w-8 h-8 drop-shadow-2xl"
                      />
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
                <button className="btn-primary w-full mt-8 py-4 text-lg font-medium">S’abonner</button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Styles des cadres animés Shimmering Frame */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 300% 0; }
        }
        .shimmer-frame {
          animation: shimmer 4s linear infinite;
          background: linear-gradient(
            90deg,
            transparent 40%,
            rgba(255,255,255,0.9) 50%,
            transparent 60%
          );
          background-size: 200% 100%;
          box-shadow: 
            0 0 15px -2px currentColor,
            inset 0 0 15px -2px currentColor;
        }
        .shimmer-frame.rose { color: #f472b6; box-shadow: 0 0 20px -3px #f472b6, inset 0 0 20px -3px #f472b6; }
        .shimmer-frame.silver { color: #e2e8f0; box-shadow: 0 0 20px -3px #e2e8f0, inset 0 0 20px -3px #e2e8f0; }
        .shimmer-frame.gold { color: #fbbf24; box-shadow: 0 0 20px -3px #fbbf24, inset 0 0 20px -3px #fbbf24; }
      `}</style>
    </div>
  );
}
