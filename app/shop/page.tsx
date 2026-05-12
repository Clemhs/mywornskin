'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import StoryCard from '@/components/StoryCard';
import { createClient } from '@/lib/supabase/client';

export default function ShopPage() {
  const supabase = createClient();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 12;

  // Filtres
  const [activeFilter, setActiveFilter] = useState<'all' | 'story' | 'voice' | 'both'>('all');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedShoeSize, setSelectedShoeSize] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'price-low' | 'price-high'>('newest');

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadTriggerRef = useRef<HTMLDivElement>(null);

  const fetchProducts = async (reset = false) => {
    if (reset) {
      setPage(0);
      setProducts([]);
      setHasMore(true);
    }

    setLoading(reset);
    setLoadingMore(!reset);

    let query = supabase
      .from('products')
      .select(`
        id, title, price, images, has_story, has_voice, worn_days, created_at,
        size, shoe_size, category, country, city, sales_count,
        creator:profiles!creator_id (username, full_name)
      `, { count: 'exact' })
      .eq('status', 'approved');

    // Recherche
    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`);
    }

    // Tri
    if (sortOption === 'price-low' || sortOption === 'price-high') {
      query = query.order('price', { ascending: sortOption === 'price-low' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const from = reset ? 0 : page * limit;
    const { data, error } = await query.range(from, from + limit - 1);

    if (error) console.error(error);
    else {
      if (reset) setProducts(data || []);
      else setProducts(prev => [...prev, ...(data || [])]);

      setHasMore((data?.length || 0) === limit);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchProducts(true);
  }, [supabase, searchTerm, sortOption, activeFilter, selectedSize, selectedShoeSize, selectedCountry, selectedCity, minPrice, maxPrice]);

  // Infinite Scroll automatique
  const lastProductRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore || !hasMore) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMore]);

  // Filtrage final (prix + autres)
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const storyVoiceMatch = 
        activeFilter === 'all' ||
        (activeFilter === 'story' && p.has_story) ||
        (activeFilter === 'voice' && p.has_voice) ||
        (activeFilter === 'both' && p.has_story && p.has_voice);

      const priceMatch = 
        (!minPrice || p.price >= Number(minPrice)) &&
        (!maxPrice || p.price <= Number(maxPrice));

      return (
        storyVoiceMatch &&
        priceMatch &&
        (!selectedSize || p.size === selectedSize) &&
        (!selectedShoeSize || p.shoe_size === selectedShoeSize) &&
        (!selectedCountry || p.country === selectedCountry) &&
        (!selectedCity || p.city === selectedCity)
      );
    });
  }, [products, activeFilter, minPrice, maxPrice, selectedSize, selectedShoeSize, selectedCountry, selectedCity]);

  // Valeurs uniques pour les filtres
  const uniqueSizes = useMemo(() => [...new Set(products.map(p => p.size).filter(Boolean))], [products]);
  const uniqueShoeSizes = useMemo(() => [...new Set(products.map(p => p.shoe_size).filter(Boolean))].sort((a,b) => Number(a)-Number(b)), [products]);
  const uniqueCountries = useMemo(() => [...new Set(products.map(p => p.country).filter(Boolean))], [products]);
  const uniqueCities = useMemo(() => [...new Set(products.map(p => p.city).filter(Boolean))], [products]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">Boutique</h1>
        <p className="text-center text-zinc-400 text-lg sm:text-xl mb-10">
          Pièces portées avec passion • {filteredProducts.length} pièces
        </p>

        {/* Recherche */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Rechercher un titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-3xl px-6 py-3 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Filtres principaux */}
        <div className="flex justify-center mb-8 gap-2 flex-wrap">
          {[
            { label: 'Tout', value: 'all' },
            { label: 'Avec histoire', value: 'story' },
            { label: 'Avec vocal', value: 'voice' },
            { label: 'Histoire + Vocal', value: 'both' },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value as any)}
              className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all ${
                activeFilter === f.value ? 'bg-rose-500 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Filtres avancés */}
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
            <input type="number" placeholder="Prix min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 w-28 text-sm" />
            <input type="number" placeholder="Prix max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 w-28 text-sm" />
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
          <p className="text-center text-zinc-400 py-20">Aucune pièce trouvée avec ces filtres.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
              {filteredProducts.map((product, index) => {
                const isLast = index === filteredProducts.length - 1;
                const isNew = new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                const isBestSeller = (product.sales_count || 0) >= 10;

                return (
                  <div key={product.id} ref={isLast ? lastProductRef : null} className="relative">
                    <StoryCard
                      id={product.id}
                      title={product.title}
                      creator={product.creator?.full_name || product.creator?.username || 'Créatrice'}
                      creatorSlug={product.creator?.username}
                      price={product.price}
                      image={product.images?.[0]}
                      hasStory={product.has_story}
                      hasVoice={product.has_voice}
                      wornDays={product.worn_days}
                    />
                    {isNew && <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium">Nouveauté</div>}
                    {isBestSeller && <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-medium">Plus vendu</div>}
                  </div>
                );
              })}
            </div>

            {loadingMore && <p className="text-center text-zinc-400 mt-10">Chargement de plus de pièces...</p>}
          </>
        )}
      </div>
    </main>
  );
}
