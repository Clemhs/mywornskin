'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const allCreators = [
  { id: '1', username: '@LilaNoir', name: 'Lila Noir', avatar: 'https://picsum.photos/id/64/300/300', banner: 'https://picsum.photos/id/1015/800/400', bio: 'Vêtements portés avec passion • Odeurs intimes garanties', price: 9.90, verified: true, volume: 127 },
  { id: '2', username: '@VelvetMuse', name: 'Velvet Muse', avatar: 'https://picsum.photos/id/65/300/300', banner: 'https://picsum.photos/id/201/800/400', bio: 'Lingerie fine et moments intenses', price: 12.90, verified: true, volume: 84 },
  { id: '3', username: '@SiennaRose', name: 'Sienna Rose', avatar: 'https://picsum.photos/id/66/300/300', banner: 'https://picsum.photos/id/133/800/400', bio: 'Chaussures et bas portés toute la journée', price: 8.90, verified: false, volume: 43 },
  { id: '4', username: '@LunaVelvet', name: 'Luna Velvet', avatar: 'https://picsum.photos/id/67/300/300', banner: 'https://picsum.photos/id/180/800/400', bio: 'Tout ce que j’ai porté cette semaine', price: 11.90, verified: true, volume: 219 },
];

export default function Creators() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'new'>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'new' | 'price-low' | 'price-high'>('popular');
  const [visibleCount, setVisibleCount] = useState(12);

  const filteredCreators = useMemo(() => {
    let filtered = allCreators.filter(creator => {
      const matchesSearch = creator.name.toLowerCase().includes(search.toLowerCase()) || 
                           creator.username.toLowerCase().includes(search.toLowerCase());
      
      const matchesFilter = filter === 'all' || 
                           (filter === 'verified' && creator.verified) || 
                           (filter === 'new' && creator.volume < 50);
      
      const matchesPrice = priceRange === 'all' ||
                          (priceRange === 'low' && creator.price <= 10) ||
                          (priceRange === 'mid' && creator.price > 10 && creator.price <= 20) ||
                          (priceRange === 'high' && creator.price > 20);

      return matchesSearch && matchesFilter && matchesPrice;
    });

    if (sortBy === 'new') filtered.sort((a, b) => b.id.localeCompare(a.id));
    if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);

    return filtered;
  }, [search, filter, priceRange, sortBy]);

  const displayedCreators = filteredCreators.slice(0, visibleCount);

  const loadMore = () => setVisibleCount(prev => prev + 8);

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Découvrir les créatrices</h1>
          <p className="text-zinc-400 text-lg">Trouve celle qui te correspond</p>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-6 mb-10 flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Rechercher une créatrice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[220px] input"
          />

          <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="input">
            <option value="all">Toutes</option>
            <option value="verified">Vérifiées</option>
            <option value="new">Nouvelles</option>
          </select>

          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value as any)} className="input">
            <option value="all">Tous les prix</option>
            <option value="low">Moins de 10€</option>
            <option value="mid">10 - 20€</option>
            <option value="high">Plus de 20€</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="input">
            <option value="popular">Les plus populaires</option>
            <option value="new">Les plus récentes</option>
            <option value="price-low">Prix croissant</option>
            <option value="price-high">Prix décroissant</option>
          </select>
        </div>

        <p className="text-zinc-400 mb-6">{filteredCreators.length} créatrices trouvées</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayedCreators.map((creator) => (
            <div key={creator.id} className="card group overflow-hidden">
              <div className="relative h-56">
                <Image src={creator.banner} alt="" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
                
                {creator.verified && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    ✓ Vérifiée
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Image src={creator.avatar} alt="" width={64} height={64} className="rounded-full ring-2 ring-zinc-800" />
                  <div>
                    <h3 className="font-semibold text-xl">{creator.name}</h3>
                    <p className="text-rose-400">{creator.username}</p>
                  </div>
                </div>

                <p className="text-zinc-400 line-clamp-2 mb-6">{creator.bio}</p>

                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-2xl font-bold">{creator.volume}</span>
                    <span className="text-xs text-zinc-500 ml-1">ventes</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-zinc-400">Abonnement</span>
                    <div className="text-xl font-semibold text-rose-400">{creator.price} €/mois</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link href={`/creators/${creator.id}`} className="flex-1 btn-secondary py-4 text-center">
                    Voir le profil
                  </Link>
                  <button className="flex-1 btn-primary py-4">
                    S'abonner
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < filteredCreators.length && (
          <div className="flex justify-center mt-12">
            <button onClick={loadMore} className="btn-secondary px-10 py-4 text-lg">
              Charger plus de créatrices
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
