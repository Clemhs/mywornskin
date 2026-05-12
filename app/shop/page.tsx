'use client';

import { useState, useEffect, useMemo } from 'react';
import StoryCard from '@/components/StoryCard';
import { createClient } from '@/lib/supabase/client';

export default function ShopPage() {
  const supabase = createClient();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState<'all' | 'story' | 'voice' | 'both'>('all');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedShoeSize, setSelectedShoeSize] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'price-low' | 'price-high'>('newest');

  // === DEBUG : Chargement simple et complet ===
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          creator:profiles!creator_id (
            username, 
            full_name, 
            city, 
            country
          )
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("❌ Erreur Supabase :", error);
      } else {
        console.log("✅ Produits récupérés :", data);
        setProducts(data || []);
      }

      setLoading(false);
    };

    fetchAll();
  }, [supabase]);

  // Valeurs uniques pour les filtres
  const uniqueSizes = useMemo(() => [...new Set(products.map(p => p.size).filter(Boolean))], [products]);
  const uniqueShoeSizes = useMemo(() => [...new Set(products.map(p => p.shoe_size).filter(Boolean))].sort((a,b)=>Number(a)-Number(b)), [products]);
  const uniqueCountries = useMemo(() => [...new Set(products.map(p => p.creator?.country).filter(Boolean))], [products]);
  const uniqueCities = useMemo(() => [...new Set(products.map(p => p.creator?.city).filter(Boolean))], [products]);

  // Filtrage
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const storyVoiceMatch = 
        activeFilter === 'all' ||
        (activeFilter === 'story' && p.has_story) ||
        (activeFilter === 'voice' && p.has_voice) ||
        (activeFilter === 'both' && p.has_story && p.has_voice);

      return (
        storyVoiceMatch &&
        (!selectedSize || p.size === selectedSize) &&
        (!selectedShoeSize || p.shoe_size === selectedShoeSize) &&
        (!selectedCountry || p.creator?.country === selectedCountry) &&
        (!selectedCity || p.creator?.city === selectedCity)
      );
    });
  }, [products, activeFilter, selectedSize, selectedShoeSize, selectedCountry, selectedCity]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">Boutique</h1>
        <p className="text-center text-zinc-400 text-lg mb-10">
          Pièces portées avec passion • {filteredProducts.length} pièces
        </p>

        {/* Filtres */}
        <div className="flex justify-center gap-3 flex-wrap mb-8">
          {['all','story','voice','both'].map(v => (
            <button
              key={v}
              onClick={() => setActiveFilter(v as any)}
              className={`px-6 py-3 rounded-2xl text-sm font-medium ${activeFilter === v ? 'bg-rose-500 text-white' : 'bg-zinc-900 text-zinc-400'}`}
            >
              {v === 'all' ? 'Tout' : v === 'story' ? 'Avec histoire' : v === 'voice' ? 'Avec vocal' : 'Histoire + Vocal'}
            </button>
          ))}
        </div>

        {/* Filtres avancés */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3">
            <option value="">Toutes tailles</option>
            {uniqueSizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={selectedShoeSize} onChange={e => setSelectedShoeSize(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3">
            <option value="">Toutes pointures</option>
            {uniqueShoeSizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3">
            <option value="">Tous pays</option>
            {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3">
            <option value="">Toutes villes</option>
            {uniqueCities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={sortOption} onChange={e => setSortOption(e.target.value as any)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3">
            <option value="newest">Plus récents</option>
            <option value="price-low">Prix croissant</option>
            <option value="price-high">Prix décroissant</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center text-zinc-400 py-20">Chargement...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-zinc-400 py-20">Aucune pièce trouvée avec ces filtres.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {filteredProducts.map(product => (
              <StoryCard
                key={product.id}
                id={product.id}
                title={product.title}
                creator={product.creator?.full_name || product.creator?.username}
                creatorSlug={product.creator?.username}
                price={product.price}
                image={product.images?.[0]}
                hasStory={product.has_story}
                hasVoice={product.has_voice}
                wornDays={product.worn_days}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
