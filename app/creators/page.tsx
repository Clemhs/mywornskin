'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { Star } from 'lucide-react';
import CreatorAvatarWithFrame from '@/components/CreatorAvatarWithFrame';
import { createClient } from '@/lib/supabase/client';

export default function CreatorsPage() {
  const supabase = createClient();

  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedShoeSize, setSelectedShoeSize] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'top' | 'new'>('all');

  useEffect(() => {
    const fetchCreators = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, banner_url, sales_badge, frame, bio, country, city, size, shoe_size')
        .or('is_creator.eq.true,role.eq.creator')   // ← Plus tolérant
        .order('sales_badge', { ascending: false });

      if (error) console.error("Erreur :", error);
      else setCreators(data || []);

      setLoading(false);
    };

    fetchCreators();
  }, [supabase]);

  // ... (le reste du code reste identique à ce que tu avais)

  const filteredCreators = useMemo(() => {
    return creators.filter(creator => {
      const matchesSearch = 
        !searchTerm || 
        (creator.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         creator.username?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCountry = !selectedCountry || creator.country === selectedCountry;
      const matchesCity = !selectedCity || creator.city === selectedCity;
      const matchesSize = !selectedSize || creator.size === selectedSize;
      const matchesShoeSize = !selectedShoeSize || creator.shoe_size === selectedShoeSize;

      let matchesFilter = true;
      if (activeFilter === 'top') matchesFilter = (creator.sales_badge || 0) >= 10;

      return matchesSearch && matchesCountry && matchesCity && matchesSize && matchesShoeSize && matchesFilter;
    });
  }, [creators, searchTerm, selectedCountry, selectedCity, selectedSize, selectedShoeSize, activeFilter]);

  const countries = [...new Set(creators.map(c => c.country).filter(Boolean))];
  const cities = [...new Set(creators.map(c => c.city).filter(Boolean))];
  const sizes = [...new Set(creators.map(c => c.size).filter(Boolean))];
  const shoeSizes = [...new Set(creators.map(c => c.shoe_size).filter(Boolean))];

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">Nos Créatrices</h1>
        <p className="text-center text-zinc-400 text-lg sm:text-xl mb-10">
          Elles partagent leur intimité avec vous • {filteredCreators.length} créatrices
        </p>

        {/* Recherche + Filtres (identique à avant) */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Rechercher une créatrice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
          />

          <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-pink-500 min-w-[180px]">
            <option value="">Tous les pays</option>
            {countries.map(country => <option key={country} value={country}>{country}</option>)}
          </select>

          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-pink-500 min-w-[180px]">
            <option value="">Toutes les villes</option>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>

          <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-pink-500 min-w-[140px]">
            <option value="">Toutes tailles</option>
            {sizes.map(size => <option key={size} value={size}>{size}</option>)}
          </select>

          <select value={selectedShoeSize} onChange={(e) => setSelectedShoeSize(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-pink-500 min-w-[140px]">
            <option value="">Toutes pointures</option>
            {shoeSizes.map(shoe => <option key={shoe} value={shoe}>{shoe}</option>)}
          </select>
        </div>

        {/* Filtres rapides */}
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
        ) : filteredCreators.length === 0 ? (
          <p className="text-center text-zinc-400 py-20">
            Aucune créatrice trouvée avec ces filtres.
          </p>
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

                <div className="p-5 pt-14 flex-1 flex flex-col">
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
