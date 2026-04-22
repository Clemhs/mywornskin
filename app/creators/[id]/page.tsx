'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const creatorsData: any = {
  1: { username: "LilaNoir", avatar: "https://picsum.photos/id/64/300/300", banner: "https://picsum.photos/id/1015/1200/400", bio: "Je partage ce que j’ai porté avec envie. Chaque pièce garde un peu de ma chaleur et de mon odeur.", followers: "12.4k", items: 24, joined: "Mars 2025" },
  2: { username: "VelvetMuse", avatar: "https://picsum.photos/id/65/300/300", banner: "https://picsum.photos/id/102/1200/400", bio: "Des vêtements qui ont vécu avec moi. Des nuits, des matins, des moments intimes.", followers: "8.9k", items: 19, joined: "Janvier 2025" },
  3: { username: "SatinSecret", avatar: "https://picsum.photos/id/66/300/300", banner: "https://picsum.photos/id/1033/1200/400", bio: "Ce que je portais quand je me sentais belle. Viens découvrir mon univers.", followers: "15.2k", items: 31, joined: "Février 2025" },
  4: { username: "RoseObsession", avatar: "https://picsum.photos/id/67/300/300", banner: "https://picsum.photos/id/106/1200/400", bio: "Sensualité, dentelle et souvenirs. Chaque vêtement raconte une partie de moi.", followers: "6.7k", items: 17, joined: "Avril 2025" },
};

export default function CreatorProfile() {
  const params = useParams();
  const id = Number(params.id);
  const creator = creatorsData[id];

  const [subscribed, setSubscribed] = useState(false);

  if (!creator) {
    return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center text-2xl">Créateur non trouvé</div>;
  }

  const handleSubscribe = () => {
    setSubscribed(true);
    alert(`✅ Vous êtes maintenant abonné à @${creator.username} pour 9,90 €/mois !`);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="relative h-80">
        <img src={creator.banner} alt={creator.username} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/70 to-zinc-950" />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <img src={creator.avatar} alt={creator.username} className="w-40 h-40 rounded-3xl border-4 border-zinc-900 object-cover" />
          </div>

          <div className="flex-1 pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-5xl font-bold">@{creator.username}</h1>
                <p className="text-rose-400 mt-1">{creator.followers} abonnés • {creator.items} pièces</p>
              </div>

              <button
                onClick={handleSubscribe}
                disabled={subscribed}
                className={`px-10 py-4 rounded-2xl font-semibold text-lg transition-all flex items-center gap-2 ${
                  subscribed 
                    ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed' 
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {subscribed ? "✓ Abonné" : "S'abonner • 9,90 €/mois"}
              </button>
            </div>

            <p className="mt-10 text-zinc-300 text-lg leading-relaxed max-w-2xl">
              {creator.bio}
            </p>
            <p className="text-zinc-500 mt-6">Membre depuis {creator.joined}</p>
          </div>
        </div>

        {/* Galerie */}
        <div className="mt-20">
          <h2 className="text-3xl font-semibold mb-8">Ses dernières pièces</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-rose-500/30 transition-all">
                <div className="aspect-square relative">
                  <img 
                    src={`https://picsum.photos/id/${100 + i}/600/600`} 
                    alt="item" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                    <p className="text-sm font-medium">Pièce #{i+1}</p>
                    <p className="text-rose-400 text-xs">29,90 €</p>
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
