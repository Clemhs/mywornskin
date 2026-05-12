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
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'price-low' | 'price-high'>('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      console.log("🔄 Début chargement produits...");

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          creator:profiles!creator_id (username, full_name, city, country)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error("❌ Erreur Supabase produits :", error);
      } else {
        console.log(`✅ Produits chargés : ${data?.length || 0}`);
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [supabase]);

  const uniqueSizes = useMemo(() => [...new Set(products.map(p => p.size).filter(Boolean))], [products]);
  const uniqueShoeSizes = useMemo(() => [...new Set(products.map(p => p.shoe_size).filter(Boolean))].sort((a,b) => Number(a)-Number(b)), [products]);
  const uniqueCountries = useMemo(() => [...new Set(products.map(p => p.creator?.country).filter(Boolean))], [products]);
  const uniqueCities = useMemo(() => [...new Set(products.map(p => p.creator?.city).filter(Boolean))], [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Correction du filtre "Avec histoire" / "Avec vocal"
        const hasStory = p.has_story === true || !!p.story?.trim();
        const hasVoice = p.has_voice === true || !!p.voice_url;

        const storyVoiceMatch = activeFilter === 'all' ||
          (activeFilter === 'story' && hasStory) ||
          (activeFilter === 'voice' && hasVoice) ||
          (activeFilter === 'both' && hasStory && hasVoice);

        const priceMatch = (!minPrice || (p.price || 0) >= Number(minPrice)) &&
                          (!maxPrice || (p.price || 0) <= Number(maxPrice));

        const searchMatch = !searchTerm || 
          p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.creator?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.creator?.username?.toLowerCase().includes(searchTerm.toLowerCase());

        return storyVoiceMatch && 
               priceMatch && 
               searchMatch &&
               (!selectedSize || p.size === selectedSize) &&
               (!selectedShoeSize || p.shoe_size === selectedShoeSize) &&
               (!selectedCountry || p.creator?.country === selectedCountry) &&
               (!selectedCity || p.creator?.city === selectedCity);
      })
      .sort((a, b) => {
        if (sortOption === 'price-low') return (a.price || 0) - (b.price || 0);
        if (sortOption === 'price-high') return (b.price || 0) - (a.price || 0);
        return 0;
      });
  }, [products, activeFilter, searchTerm, minPrice, maxPrice, selectedSize, selectedShoeSize, selectedCountry, selectedCity, sortOption]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">Boutique</h1>
        <p className="text-center text-zinc-400 text-lg sm:text-xl mb-10">
          Pièces portées avec passion • {filteredProducts.length} pièces
        </p>

        {/* Recherche */}
        <div className="max-w-md mx-auto mb-10">
          <input
            type="text"
            placeholder="Rechercher un titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-3xl px-6 py-3.5 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Filtres principaux + avancés */}
        <div className="flex justify-center mb-8 gap-2 flex-wrap">
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

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-sm">
            <option value="">Toutes tailles</option>
            {uniqueSizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={selectedShoeSize} onChange={e => setSelectedShoeSize(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-sm">
            <option value="">Toutes pointures</option>
            {uniqueShoeSizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-sm">
            <option value="">Tous pays</option>
            {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-sm">
            <option value="">Toutes villes</option>
            {uniqueCities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div className="flex gap-3">
            <input type="text" placeholder="Prix min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 w-28 text-sm" />
            <input type="text" placeholder="Prix max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 w-28 text-sm" />
          </div>

          <select value={sortOption} onChange={e => setSortOption(e.target.value as any)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-sm">
            <option value="newest">Plus récents</option>
            <option value="price-low">Prix croissant</option>
            <option value="price-high">Prix décroissant</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center text-zinc-400 py-20">Chargement des pièces...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-zinc-400 py-20">Aucune pièce trouvée.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {filteredProducts.map(product => {
              const isNew = new Date(product.created_at) > new Date(Date.now() - 7*24*60*60*1000);
              const isBestSeller = (product.sales_count || 0) >= 5;

              return (
                <div key={product.id} className="relative">
                  <StoryCard
                    id={product.id}
                    title={product.title}
                    creator={product.creator?.full_name || product.creator?.username || 'Créatrice'}
                    creatorSlug={product.creator?.username}
                    price={product.price}
                    image={product.images?.[0] || product.image}
                    hasStory={product.has_story}
                    hasVoice={product.has_voice}
                    wornDays={product.worn_days}
                  />
                  {isNew && <div className="absolute top-3 left-3 bg-emerald-500 text-[10px] px-2.5 py-1 rounded-full font-medium">NOUVEAUTÉ</div>}
                  {isBestSeller && <div className="absolute top-3 right-3 bg-amber-500 text-[10px] px-2.5 py-1 rounded-full font-medium">PLUS VENDU</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
