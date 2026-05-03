'use client';

import Link from 'next/link';
import { Star, Award } from 'lucide-react';

const creators = [
  {
    slug: "lea-moreau",
    name: "Léa Moreau",
    avatar: "https://picsum.photos/id/64/300/300",
    rating: 4.9,
    sales: 47,
    badge: "Chasseuse d'odeurs",
    description: "Spécialiste lingerie fine & moments intimes",
  },
  {
    slug: "clara-voss",
    name: "Clara Voss",
    avatar: "https://picsum.photos/id/65/300/300",
    rating: 5.0,
    sales: 32,
    badge: "Voix d'or",
    description: "Amatrice de soirées sensuelles",
  },
  {
    slug: "emma-laurent",
    name: "Emma Laurent",
    avatar: "https://picsum.photos/id/66/300/300",
    rating: 4.8,
    sales: 29,
    badge: "Conteuse",
    description: "Histoires intimes & émotions brutes",
  },
];

export default function CreatorsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <h1 className="text-5xl font-bold text-center mb-4">Nos Créatrices</h1>
        <p className="text-center text-zinc-400 text-xl mb-16">Elles partagent leur intimité avec vous</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {creators.map((creator) => (
            <Link 
              key={creator.slug}
              href={`/creators/${creator.slug}`}
              className="group bg-zinc-900 rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
            >
              <img 
                src={creator.avatar} 
                alt={creator.name}
                className="w-full h-80 object-cover"
              />
              <div className="p-8">
                <h2 className="text-2xl font-semibold">{creator.name}</h2>
                <p className="text-zinc-400 mt-1">{creator.description}</p>

                <div className="flex items-center gap-2 mt-6">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{creator.rating}</span>
                  <span className="text-zinc-500">• {creator.sales} ventes</span>
                </div>

                <div className="mt-4">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-800 rounded-2xl text-sm">
                    <Award className="w-4 h-4 text-rose-400" />
                    {creator.badge}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
