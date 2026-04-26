'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, Plus } from 'lucide-react';
import StoryCard from '../../../components/StoryCard';
import Header from '../../components/Header';

export default function CreatorProfile() {
  const params = useParams();
  const slug = params.slug as string;

  // Données simulées selon le slug
  const creator = {
    name: slug === "lea-moreau" ? "Léa Moreau" : 
          slug === "clara-voss" ? "Clara Voss" : 
          slug === "emma-laurent" ? "Emma Laurent" : "Nina Rivera",
    slug: slug,
    bio: "Passionnée de sensualité et d’histoires intimes. Chaque pièce que je vends porte une partie de moi.",
    avatar: "👩‍❤️‍💋‍👩",
    rating: 4.9,
    totalPieces: 12,
    joined: "Janvier 2026",
  };

  const herProducts = [
    {
      id: "1",
      title: "Culotte en dentelle noire",
      price: 45,
      wornDays: 3,
      image: "https://picsum.photos/id/1015/600/800",
      hasStory: true,
      hasVoice: true,
      excerpt: "Portée pendant trois jours entiers... l'odeur est encore très présente.",
      creatorName: creator.name,
      creatorSlug: creator.slug,
    },
    {
      id: "2",
      title: "Chemise blanche froissée",
      price: 68,
      wornDays: 2,
      image: "https://picsum.photos/id/251/600/800",
      hasStory: true,
      hasVoice: true,
      excerpt: "Portée au bureau pendant deux jours... avec quelques boutons défaits.",
      creatorName: creator.name,
      creatorSlug: creator.slug,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* En-tête créatrice */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-40 h-40 bg-zinc-800 rounded-3xl flex items-center justify-center text-8xl flex-shrink-0">
            {creator.avatar}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-bold">{creator.name}</h1>
            <div className="flex justify-center md:justify-start items-center gap-2 mt-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-xl font-medium">{creator.rating}</span>
            </div>
            
            <p className="text-zinc-400 mt-6 max-w-md mx-auto md:mx-0">
              {creator.bio}
            </p>

            <div className="flex justify-center md:justify-start gap-8 mt-8 text-sm">
              <div>
                <span className="block text-3xl font-semibold">{creator.totalPieces}</span>
                <span className="text-zinc-400">Pièces mises en vente</span>
              </div>
              <div>
                <span className="block text-3xl font-semibold">Membre depuis</span>
                <span className="text-zinc-400">{creator.joined}</span>
              </div>
            </div>
          </div>

          {/* Bouton nouvelle pièce */}
          <Link
            href="/become-creator"
            className="flex items-center gap-3 bg-rose-500 hover:bg-rose-600 px-8 py-4 rounded-3xl text-white font-medium self-start"
          >
            <Plus className="w-5 h-5" />
            Mettre une nouvelle pièce en vente
          </Link>
        </div>

        {/* Sa boutique */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Sa boutique</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {herProducts.map((product) => (
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
        </div>
      </div>
    </main>
  );
}
