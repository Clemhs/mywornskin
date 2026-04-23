'use client';

// V1 - Page profil créateur (luxe, cohérent avec le reste du site)

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CreatorProfile() {
  const params = useParams();
  const id = params.id as string;

  // Simulation de données (tu pourras plus tard connecter à Supabase)
  const creator = {
    id: parseInt(id),
    username: id === "3" ? "Sienna Rose" : id === "4" ? "Nova Lune" : "Lila Noir",
    avatar: "https://picsum.photos/id/1011/280/280",
    banner: "https://picsum.photos/id/1005/1200/400",
    verified: true,
    price: id === "4" ? 65 : id === "3" ? 55 : 49,
    bio: "Je partage avec toi les vêtements que j’ai portés, avec leur odeur, leur histoire et leur chaleur. Chaque pièce est unique.",
    frame: id === "3" ? "rose" : id === "4" ? "silver" : null,
    badge: id === "2" || id === "4" ? 100 : id === "1" ? 10 : null,
  };

  // Simulation d’articles en vente
  const items = [
    { id: 1, name: "Culotte en dentelle noire", price: 25, image: "https://picsum.photos/id/201/300/300" },
    { id: 2, name: "Collant porté 3 jours", price: 18, image: "https://picsum.photos/id/160/300/300" },
    { id: 3, name: "T-shirt de nuit", price: 35, image: "https://picsum.photos/id/1005/300/300" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Bannière */}
      <div className="relative h-80">
        <img src={creator.banner} alt={creator.username} className="w-full h-full object-cover" />
        
        {creator.frame && (
          <div className={`shimmer-frame absolute inset-0 rounded-b-3xl pointer-events-none ${creator.frame}`} />
        )}

        {/* Bouton retour */}
        <Link href="/creators" className="absolute top-6 left-6 bg-black/60 hover:bg-black/80 px-5 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-medium backdrop-blur-md transition">
          ← Retour
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="relative -mt-12 md:-mt-16">
            <div className="relative">
              <img 
                src={creator.avatar} 
                alt={creator.username} 
                className="w-32 h-32 md:w-40 md:h-40 rounded-3xl ring-8 ring-zinc-950 object-cover"
              />
              {creator.badge && (
                <img 
                  src={`/badges/${creator.badge}.png`} 
                  alt="badge" 
                  className="absolute -top-2 -right-2 w-10 h-10 drop-shadow-2xl"
                />
              )}
            </div>
          </div>

          {/* Infos créatrice */}
          <div className="flex-1 pt-4">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-semibold">{creator.username}</h1>
              {creator.verified && <span className="text-rose-400 text-2xl">✓</span>}
            </div>
            
            <p className="text-3xl font-semibold text-rose-400 mt-1">{creator.price}€ / mois</p>
            
            <p className="mt-6 text-zinc-300 max-w-2xl leading-relaxed">
              {creator.bio}
            </p>

            <button className="btn-primary text-lg px-12 py-6 mt-8 w-full md:w-auto">
              S’abonner à {creator.username}
            </button>
          </div>
        </div>

        {/* Articles en vente */}
        <div className="mt-16">
          <h2 className="text-2xl font-medium mb-6">Ses pièces en vente</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="card group">
                <img src={item.image} alt={item.name} className="w-full h-64 object-cover rounded-3xl" />
                <div className="p-4">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-rose-400 text-xl mt-1">{item.price}€</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Styles des cadres animés (réutilisés) */}
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
