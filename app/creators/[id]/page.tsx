'use client';

// V2 - Page profil créateur avec Boutique + bouton Personnaliser

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function CreatorProfile() {
  const params = useParams();
  const id = params.id as string;

  // Données simulées du créateur
  const creator = {
    id: parseInt(id),
    username: id === "3" ? "Sienna Rose" : id === "4" ? "Nova Lune" : "Lila Noir",
    avatar: "https://picsum.photos/id/1011/280/280",
    banner: "https://picsum.photos/id/1005/1200/400",
    verified: true,
    price: id === "4" ? 65 : id === "3" ? 55 : 49,
    bio: "Je partage avec toi les vêtements que j’ai portés, avec leur odeur, leur histoire et leur chaleur. Chaque pièce est unique.",
    frame: id === "3" ? "rose" : id === "4" ? "silver" : null,
    badge: id === "4" ? 100 : null,
  };

  // Articles en vente (boutique)
  const items = [
    { id: 1, name: "Culotte en dentelle noire", price: 25, image: "https://picsum.photos/id/201/300/300" },
    { id: 2, name: "Collant porté 3 jours", price: 18, image: "https://picsum.photos/id/160/300/300" },
    { id: 3, name: "T-shirt de nuit", price: 35, image: "https://picsum.photos/id/1005/300/300" },
    { id: 4, name: "Shorty en soie", price: 28, image: "https://picsum.photos/id/133/300/300" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Bannière + Avatar */}
      <div className="relative h-80">
        <img src={creator.banner} alt={creator.username} className="w-full h-full object-cover" />
        
        {creator.frame && (
          <div className={`shimmer-frame absolute inset-0 rounded-b-3xl pointer-events-none ${creator.frame}`} />
        )}

        {/* Bouton Personnaliser (visible sur le profil) */}
        <Link 
          href={`/creators/${id}/edit`}
          className="absolute top-6 right-6 bg-black/70 hover:bg-black/90 px-6 py-3 rounded-2xl flex items-center gap-2 text-sm font-medium backdrop-blur-md transition"
        >
          ✏️ Personnaliser mon profil
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="relative -mt-12 md:-mt-16">
            <div className="relative">
              <img src={creator.avatar} alt={creator.username} className="w-32 h-32 md:w-40 md:h-40 rounded-3xl ring-8 ring-zinc-950 object-cover" />
              {creator.badge && (
                <img src={`/badges/${creator.badge}.png`} alt="badge" className="absolute -top-2 -right-2 w-10 h-10 drop-shadow-2xl" />
              )}
            </div>
          </div>

          {/* Infos */}
          <div className="flex-1 pt-4">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-semibold">{creator.username}</h1>
              {creator.verified && <span className="text-rose-400 text-3xl">✓</span>}
            </div>
            <p className="text-3xl font-semibold text-rose-400 mt-1">{creator.price}€ / mois</p>
            <p className="mt-6 text-zinc-300 max-w-2xl leading-relaxed">{creator.bio}</p>
          </div>
        </div>

        {/* ====================== BOUTIQUE ====================== */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium">Boutique</h2>
            <Link href={`/creators/${id}/shop`} className="text-rose-400 hover:text-rose-300 text-sm flex items-center gap-1">
              Voir toute la boutique →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="card group cursor-pointer">
                <img src={item.image} alt={item.name} className="w-full h-64 object-cover rounded-3xl" />
                <div className="p-4">
                  <p className="font-medium line-clamp-2">{item.name}</p>
                  <p className="text-rose-400 text-xl mt-2">{item.price}€</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Styles des cadres animés */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 300% 0; }
        }
        .shimmer-frame {
          animation: shimmer 10s linear infinite;
          background: linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.85) 50%, transparent 60%);
          background-size: 200% 100%;
          box-shadow: 0 0 20px -3px currentColor, inset 0 0 20px -3px currentColor;
        }
        .shimmer-frame.rose   { color: #f472b6; }
        .shimmer-frame.silver { color: #e2e8f0; }
        .shimmer-frame.gold   { color: #fbbf24; }
      `}</style>
    </div>
  );
}
