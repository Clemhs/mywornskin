'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

const creatorsData: any = {
  1: { 
    username: "LilaNoir", 
    avatar: "https://picsum.photos/id/64/300/300", 
    banner: "https://picsum.photos/id/1015/1200/400", 
    bio: "Je partage ce que j’ai porté avec envie. Chaque pièce garde un peu de ma chaleur et de mon odeur.", 
    followers: "12.4k", 
    items: 87, 
    joined: "Mars 2025", 
    verified: true,
    volumeBadge: 100,
    longevity: 1 
  },
  2: { 
    username: "VelvetMuse", 
    avatar: "https://picsum.photos/id/65/300/300", 
    banner: "https://picsum.photos/id/102/1200/400", 
    bio: "Des vêtements qui ont vécu avec moi...", 
    followers: "8.9k", 
    items: 64, 
    joined: "Janvier 2025", 
    verified: true,
    volumeBadge: 50,
    longevity: 2 
  },
};

export default function CreatorProfile() {
  const params = useParams();
  const id = Number(params.id);
  const creator = creatorsData[id];

  const [subscribed, setSubscribed] = useState(false);

  if (!creator) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-2xl">Créateur non trouvé</div>;

  const handleSubscribe = () => {
    setSubscribed(true);
    alert(`✅ Vous êtes maintenant abonné à @${creator.username} pour 9,90 €/mois !`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <div className="relative h-80 md:h-96">
        <img src={creator.banner} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/70 to-zinc-950" />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 -mt-12 md:-mt-16">
            <div className="relative">
              <img 
                src={creator.avatar} 
                alt={creator.username} 
                className="w-40 h-40 rounded-3xl border-4 border-zinc-900 object-cover" 
              />
              
              {/* Badge Vérifié */}
              {creator.verified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 shadow-lg">
                  ✓ Vérifié
                </div>
              )}

              {/* Badge Volume */}
              {creator.volumeBadge && (
                <div className="absolute -top-3 -left-3 bg-zinc-900 text-white text-sm font-bold w-9 h-9 rounded-2xl flex items-center justify-center border-2 border-rose-500 shadow-lg">
                  {creator.volumeBadge}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-5xl font-bold">@{creator.username}</h1>
                <p className="text-rose-400 mt-1">{creator.followers} abonnés • {creator.items} pièces vendues</p>
              </div>
              
              <button
                onClick={handleSubscribe}
                disabled={subscribed}
                className={`btn-primary px-10 py-4 ${subscribed ? 'bg-zinc-800 cursor-not-allowed' : ''}`}
              >
                {subscribed ? "✓ Abonné" : "S'abonner • 9,90 €/mois"}
              </button>
            </div>

            <p className="mt-10 text-zinc-300 text-[17px] leading-relaxed max-w-2xl">
              {creator.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
