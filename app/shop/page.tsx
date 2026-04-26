'use client';

import { useState } from 'react';
import StoryCard from '../../components/StoryCard';
import { Filter, Sparkles, Mic, BookOpen } from 'lucide-react';

export default function Shop() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'story' | 'voice' | 'both'>('all');

  const products = [
    {
      id: "1",
      title: "Culotte en dentelle noire",
      price: 45,
      wornDays: 3,
      image: "https://picsum.photos/id/1015/600/800",
      hasStory: true,
      hasVoice: true,
      excerpt: "Portée pendant trois jours entiers... l'odeur est encore très présente.",
      creatorName: "Léa Moreau",
      creatorSlug: "lea-moreau",
    },
    {
      id: "2",
      title: "Bas résille déchirés",
      price: 32,
      wornDays: 1,
      image: "https://picsum.photos/id/201/600/800",
      hasStory: true,
      hasVoice: false,
      excerpt: "Je les ai portés toute la nuit lors d'une soirée très spéciale...",
      creatorName: "Clara Voss",
      creatorSlug: "clara-voss",
    },
    {
      id: "3",
      title: "Chemise blanche froissée",
      price: 68,
      wornDays: 2,
      image: "https://picsum.photos/id/251/600/800",
      hasStory: true,
      hasVoice: true,
      excerpt: "Portée au bureau pendant deux jours... avec quelques boutons défaits.",
      creatorName: "Emma Laurent",
      creatorSlug: "emma-laurent",
    },
    {
      id: "4",
      title: "String rouge en dentelle",
      price: 28,
      wornDays: 4,
      image: "https://picsum.photos/id/1005/600/800",
      hasStory: false,
      hasVoice: true,
      excerpt: "Porté lors d’un rendez-vous très chaud...",
      creatorName: "Nina Rivera",
      creatorSlug: "nina-rivera",
    },
  ];

  const filteredProducts = products.filter(product => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'story') return product.hasStory;
    if (activeFilter === 'voice') return product.hasVoice;
    if (activeFilter === 'both') return product.hasStory && product.hasVoice;
    return true;
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <h1 className="text-4xl font-bold">La Boutique</h1>
          
          {/* Filtres */}
          <div className="flex gap-2 mt-6 md:mt-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-3 rounded-3xl text-sm font-medium transition-all ${
                activeFilter === 'all' 
                  ? 'bg-white text-black' 
                  : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700'
              }`}
            >
              Tout
            </button>
            <button
              onClick={() => setActiveFilter('story')}
              className={`px-6 py-3 rounded-3xl text-sm font-medium flex items-center gap-2 transition-all ${
                activeFilter === 'story' 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Avec Histoire
            </button>
            <button
              onClick={() => setActiveFilter('voice')}
              className={`px-6 py-3 rounded-3xl text-sm font-medium flex items-center gap-2 transition-all ${
                activeFilter === 'voice' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700'
              }`}
            >
              <Mic className="w-4 h-4" />
              Avec Vocal
            </button>
            <button
              onClick={() => setActiveFilter('both')}
              className={`px-6 py-3 rounded-3xl text-sm font-medium flex items-center gap-2 transition-all ${
                activeFilter === 'both' 
                  ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white' 
                  : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700'
              }`}
            >
              Histoire + Vocal
            </button>
          </div>
        </div>

        {/* Résultats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <StoryCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              wornDays={product.wornDays}
              image={product.image}
              hasStory={product.hasStory}
              hasVoice={product.hasVoice}
              excerpt={product.excerpt}
              creatorName={product.creatorName}
              creatorSlug={product.creatorSlug}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center text-zinc-400 py-20 text-xl">
            Aucune pièce ne correspond à ce filtre.
          </p>
        )}
      </div>
    </main>
  );
}
