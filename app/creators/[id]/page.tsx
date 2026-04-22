'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const creatorsData: any = {
  1: {
    username: "LilaNoir",
    avatar: "https://picsum.photos/id/64/300/300",
    banner: "https://picsum.photos/id/1015/1200/400",
    bio: "Je partage ce que j’ai porté avec envie. Chaque pièce garde un peu de ma chaleur et de mon odeur.",
    followers: "12.4k",
    items: 24,
    joined: "Mars 2025",
  },
  2: {
    username: "VelvetMuse",
    avatar: "https://picsum.photos/id/65/300/300",
    banner: "https://picsum.photos/id/102/1200/400",
    bio: "Des vêtements qui ont vécu avec moi. Des nuits, des matins, des moments intimes.",
    followers: "8.9k",
    items: 19,
    joined: "Janvier 2025",
  },
  3: {
    username: "SatinSecret",
    avatar: "https://picsum.photos/id/66/300/300",
    banner: "https://picsum.photos/id/1033/1200/400",
    bio: "Ce que je portais quand je me sentais belle. Viens découvrir mon univers.",
    followers: "15.2k",
    items: 31,
    joined: "Février 2025",
  },
  4: {
    username: "RoseObsession",
    avatar: "https://picsum.photos/id/67/300/300",
    banner: "https://picsum.photos/id/106/1200/400",
    bio: "Sensualité en seconde main. Viens sentir mon univers.",
    followers: "6.7k",
    items: 17,
    joined: "Avril 2025",
  },
};

export default function CreatorProfile() {
  const params = useParams();
  const id = Number(params.id);
  const creator = creatorsData[id];

  const [subscribed, setSubscribed] = useState(false);

  if (!creator) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Créateur non trouvé
      </div>
    );
  }

  const handleSubscribe = () => {
    setSubscribed(true);
    alert(`✅ Vous êtes maintenant abonné à @${creator.username} pour 9,90 €/mois !`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Banner */}
      <div className="relative h-80 md:h-96">
        <img 
          src={creator.banner} 
          alt={creator.username} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/60 to-zinc-950" />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16 md:-mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0 -mt-12 md:-mt-16">
            <img 
              src={creator.avatar} 
              alt={creator.username} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-zinc-900 object-cover shadow-2xl" 
            />
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">@{creator.username}</h1>
                <p className="text-rose-400 mt-2 text-lg">
                  {creator.followers} abonnés • {creator.items} pièces
                </p>
              </div>

              <button
                onClick={handleSubscribe}
                disabled={subscribed}
                className={`px-10 py-4 rounded-2xl font-semibold text-base md:text-lg transition-all whitespace-nowrap ${
                  subscribed 
                    ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed' 
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {subscribed ? "✓ Abonné" : "S'abonner • 9,90 €/mois"}
              </button>
            </div>

            <p className="mt-10 text-zinc-300 text-[17px] leading-relaxed max-w-2xl">
              {creator.bio}
            </p>

            <p className="text-zinc-500 mt-6">Membre depuis {creator.joined}</p>
          </div>
        </div>

        {/* Galerie des pièces */}
        <div className="mt-20">
          <h2 className="text-3xl font-semibold mb-10">Ses dernières pièces</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-rose-500/30 transition-all"
              >
                <div className="aspect-[4/3] relative">
                  <img 
                    src={`https://picsum.photos/id/${100 + i}/600/450`} 
                    alt="Pièce" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-5">
                    <p className="text-sm font-medium">Pièce #{i + 1}</p>
                    <p className="text-rose-400 text-sm">29,90 €</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
