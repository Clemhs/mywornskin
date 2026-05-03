'use client';

import { useState, useEffect } from 'react';
import StoryCard from '@/components/StoryCard';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'story' | 'voice' | 'both'>('all');

  // Pour l'instant on simule les produits (on branchera Supabase plus tard)
  useEffect(() => {
    // Simulation de données
    const mockProducts = [
      { id: "1", title: "Culotte en dentelle noire", creator: "Léa Moreau", price: 45, image: "https://picsum.photos/id/1015/600/800", has_story: true, has_voice: true, worn_days: 3 },
      { id: "2", title: "Bas résille déchirés", creator: "Clara Voss", price: 32, image: "https://picsum.photos/id/201/600/800", has_story: true, has_voice: false, worn_days: 1 },
      { id: "3", title: "Chemise blanche froissée", creator: "Emma Laurent", price: 68, image: "https://picsum.photos/id/251/600/800", has_story: true, has_voice: true, worn_days: 2 },
      { id: "4", title: "String rouge passion", creator: "Léa Moreau", price: 28, image: "https://picsum.photos/id/1027/600/800", has_story: true, has_voice: true, worn_days: 4 },
    ];

    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const filteredProducts = products.filter(product => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'story') return product.has_story === true;
    if (activeFilter === 'voice') return product.has_voice === true;
    if (activeFilter === 'both') return product.has_story === true && product.has_voice === true;
    return true;
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">Boutique</h1>
        <p className="text-center text-zinc-400 text-lg sm:text-xl mb-10">
          Pièces portées avec passion • {filteredProducts.length} pièces
        </p>

        {/* Filtres */}
        <div className="flex justify-center mb-12">
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
                  creator={product.creator}
                  price={product.price}
                  image={product.image}
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
