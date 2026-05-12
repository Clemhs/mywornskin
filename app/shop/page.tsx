'use client';

import { useState, useEffect, useMemo } from 'react';
import StoryCard from '@/components/StoryCard';
import { createClient } from '@/lib/supabase/client';

export default function ShopPage() {
  const supabase = createClient();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'story' | 'voice' | 'both'>('all');
  const [selectedShoeSize, setSelectedShoeSize] = useState<string>('');

  // Récupération des vrais produits depuis Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, title, price, image, images, has_story, has_voice, worn_days, 
          size, shoe_size, category,
          creator:profiles!creator_id (username, full_name)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setProducts(data || []);

      setLoading(false);
    };

    fetchProducts();
  }, [supabase]);

  // Filtrage
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchStoryVoice =
        activeFilter === 'all' ||
        (activeFilter === 'story' && product.has_story) ||
        (activeFilter === 'voice' && product.has_voice) ||
        (activeFilter === 'both' && product.has_story && product.has_voice);

      const matchShoeSize = !selectedShoeSize || product.shoe_size === selectedShoeSize;

      return matchStoryVoice && matchShoeSize;
    });
  }, [products, activeFilter, selectedShoeSize]);

  // Liste unique des pointures disponibles
  const availableShoeSizes = useMemo(() => {
    const sizes = new Set(products.map(p => p.shoe_size).filter(Boolean));
    return Array.from(sizes).sort((a, b) => Number(a) - Number(b));
  }, [products]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">Boutique</h1>
        <p className="text-center text-zinc-400 text-lg sm:text-xl mb-10">
          Pièces portées avec passion • {filteredProducts.length} pièces
        </p>

        {/* Filtres existants (design inchangé) */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4">
            {[
              { label: 'Tout', value: 'all' },
              { label: 'Avec histoire', value: 'story' },
              { label: 'Avec vocal', value: 'voice' },
              { label: 'Histoire + Vocal', value: 'both' },
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

        {/* Nouveau filtre Pointure */}
        {availableShoeSizes.length > 0 && (
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 text-sm">Pointure :</span>
              <select
                value={selectedShoeSize}
                onChange={(e) => setSelectedShoeSize(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-2.5 text-sm focus:outline-none focus:border-rose-500"
              >
                <option value="">Toutes</option>
                {availableShoeSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-center text-zinc-400 py-20">Chargement des pièces...</p>
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
                  image={product.images?.[0] || product.image}
                  hasStory={product.has_story}
                  hasVoice={product.has_voice}
                  wornDays={product.worn_days}
                />
              ))}
            </div>

            {filteredProducts.length > 0 && (
              <p className="text-center text-zinc-500 mt-16 text-lg">
                Vous avez tout vu ! 🎉
              </p>
            )}
          </>
        )}

        {filteredProducts.length === 0 && !loading && (
          <p className="text-center text-zinc-400 py-20">Aucune pièce trouvée avec ces filtres.</p>
        )}
      </div>
    </main>
  );
}
