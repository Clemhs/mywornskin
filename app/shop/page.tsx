'use client';

import { useState, useEffect, useMemo } from 'react';
import StoryCard from '@/components/StoryCard';

export default function ShopPage() {
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
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // ... (le reste du code reste identique : uniqueSizes, filteredProducts, return)
  const uniqueSizes = useMemo(() => [...new Set(products.map(p => p.size).filter(Boolean))], [products]);
  const uniqueShoeSizes = useMemo(() => [...new Set(products.map(p => p.shoe_size).filter(Boolean))].sort((a,b) => Number(a)-Number(b)), [products]);
  const uniqueCountries = useMemo(() => [...new Set(products.map(p => p.creator?.country).filter(Boolean))], [products]);
  const uniqueCities = useMemo(() => [...new Set(products.map(p => p.creator?.city).filter(Boolean))], [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
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

        {/* Recherche, filtres, grille... (copie le reste de ton ancien code) */}
        {/* ... (je peux te le redonner complet si besoin) ... */}

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
