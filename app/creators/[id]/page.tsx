'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function CreatorProfile() {
  // Données simulées (dans la vraie version ce sera dynamique via params)
  const creator = {
    id: 1,
    username: "Lila Noir",
    avatar: "https://picsum.photos/id/64/128/128",
    banner: "https://picsum.photos/id/201/1200/400",
    verified: true,
    new: true,
    price: 49,
    bio: "Vêtements portés avec passion • Chaque pièce porte mon odeur et ma chaleur. Prêt(e) à découvrir mon intimité ?",
    subscribers: 1248,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Banner */}
      <div className="relative h-64 md:h-80">
        <Image src={creator.banner} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/60 to-zinc-950" />
        
        <div className="absolute top-6 left-6 flex items-center gap-3">
          {creator.verified && <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-2xl font-medium">✓ Vérifiée</span>}
          {creator.new && <span className="bg-rose-500 text-white text-xs px-3 py-1 rounded-2xl font-medium">✦ Nouvelle</span>}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar + Info */}
          <div className="flex-shrink-0">
            <Image 
              src={creator.avatar} 
              alt={creator.username} 
              width={160} 
              height={160} 
              className="rounded-3xl ring-4 ring-rose-500/30 mx-auto md:mx-0" 
            />
          </div>

          <div className="flex-1 pt-4">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-semibold">{creator.username}</h1>
              <div className="text-right">
                <div className="text-3xl font-semibold text-rose-400">{creator.price}€</div>
                <div className="text-sm text-zinc-400">par pièce</div>
              </div>
            </div>
            
            <p className="text-zinc-400 mt-2">{creator.bio}</p>
            
            <div className="flex gap-8 mt-8 text-sm">
              <div>
                <span className="font-semibold text-xl">{creator.subscribers}</span>
                <span className="block text-zinc-400">abonnés</span>
              </div>
              <div>
                <span className="font-semibold text-xl">42</span>
                <span className="block text-zinc-400">pièces vendues</span>
              </div>
            </div>

            <button className="btn-primary w-full md:w-auto px-16 py-7 text-xl font-medium mt-10">
              S’abonner • {creator.price}€ / mois
            </button>
          </div>
        </div>

        {/* Galerie des pièces */}
        <div className="mt-16">
          <h2 className="text-2xl font-medium mb-6">Dernières pièces mises en vente</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="card aspect-video overflow-hidden">
                <Image 
                  src={`https://picsum.photos/id/${200 + i}/600/400`} 
                  alt="" 
                  fill 
                  className="object-cover hover:scale-105 transition" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
