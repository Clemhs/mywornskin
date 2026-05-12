'use client';

import { useState, useEffect, useMemo } from 'react';
import StoryCard from '@/components/StoryCard';
import { createClient } from '@/lib/supabase/client';

export default function ShopPage() {
  const supabase = createClient();

  const [products, setProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]); // Pour les filtres
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 12;

  // Filtres
  const [activeFilter, setActiveFilter] = useState<'all' | 'story' | 'voice' | 'both'>('all');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedShoeSize, setSelectedShoeSize] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'price-low' | 'price-high'>('newest');

  // Récupération des produits
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
        id, title, price, images, has_story, has_voice, worn_days,
        size, shoe_size, category, country, city,
        creator:profiles!creator_id (username, full_name)
      `, { count: 'exact' })
      .eq('status', 'approved')
      .order(sortOption === 'price-low' ? 'price' : 'created_at', 
            { ascending: sortOption === 'price-low' });

    if (sortOption === 'price-high') {
      query = query.order('price', { ascending: false });
    }

    const from = (page * limit);
    const { data, error, count } = await query.range(from, from + limit - 1);

    if (error) console.error(error);
    else {
      if (reset) setProducts(data || []);
      else setProducts(prev => [...prev, ...(data || [])]);

      setHasMore((data?.length || 0) === limit);
      if (reset) setAllProducts(data || []); // Pour extraire les filtres uniques
    }

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchProducts(true);
  }, [sortOption, activeFilter, selectedSize, selectedShoeSize, selectedCountry, selectedCity]);

  // Extraction des valeurs uniques pour les filtres
  const uniqueSizes = useMemo(() => [...new Set(allProducts.map(p => p.size).filter(Boolean))], [allProducts]);
  const uniqueCountries = useMemo(() => [...new Set(allProducts.map(p => p.country).filter(Boolean))], [allProducts]);
  const uniqueCities = useMemo(() => [...new Set(allProducts.map(p => p.city).filter(Boolean))], [allProducts]);
  const uniqueShoeSizes = useMemo(() => [...new Set(allProducts.map(p => p.shoe_size).filter(Boolean))].sort((a,b) => Number(a)-Number(b)), [allProducts]);

  // Filtrage côté client (pour les filtres story/voice + taille/pays/ville)
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const storyMatch = activeFilter === 'all' || 
                        (activeFilter === 'story' && p.has_story) ||
                        (activeFilter === 'voice' && p.has_voice) ||
                        (activeFilter === 'both' && p.has_story && p.has_voice);

      const sizeMatch = !selectedSize || p.size === selectedSize;
      const countryMatch = !selectedCountry || p.country === selectedCountry;
      const cityMatch = !selectedCity || p.city === selectedCity;
      const shoeMatch = !selectedShoeSize || p.shoe_size === selectedShoeSize;

      return storyMatch && sizeMatch && countryMatch && cityMatch && shoeMatch;
    });
  }, [products, activeFilter, selectedSize, selectedCountry, selectedCity, selectedShoeSize]);

  const loadMore = () => {
    setPage(prev => prev + 1);
    fetchProducts(false);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">Boutique</h1>
        <p className="text-center text-zinc-400 text-lg sm:text-xl mb-10">
          Pièces portées avec passion • {filteredProducts.length} pièces
        </p>

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
          <p className="text-center text-zinc-400 py-20">Chargement des pièces...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-zinc-400 py-20">Aucune pièce trouvée avec ces filtres.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
              {filteredProducts.map((product) => (
                <StoryCard
                  key={product.id}
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
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-zinc-800 hover:bg-zinc-700 px-10 py-4 rounded-2xl font-medium disabled:opacity-50"
                >
                  {loadingMore ? "Chargement..." : "Charger plus"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
