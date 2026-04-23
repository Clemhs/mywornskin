'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

const creatorsData: any = {
  1: { username: "LilaNoir", avatar: "https://picsum.photos/id/64/300/300", banner: "https://picsum.photos/id/1015/1200/400", bio: "Je partage ce que j’ai porté avec envie...", followers: "12.4k", items: 24, joined: "Mars 2025", verified: true },
  2: { username: "VelvetMuse", avatar: "https://picsum.photos/id/65/300/300", banner: "https://picsum.photos/id/102/1200/400", bio: "Des vêtements qui ont vécu avec moi...", followers: "8.9k", items: 19, joined: "Janvier 2025", verified: true },
  3: { username: "SatinSecret", avatar: "https://picsum.photos/id/66/300/300", banner: "https://picsum.photos/id/1033/1200/400", bio: "Ce que je portais quand je me sentais belle...", followers: "15.2k", items: 31, joined: "Février 2025", verified: false },
};

export default function CreatorProfile() {
  const params = useParams();
  const id = Number(params.id);
  const creator = creatorsData[id];

  const [subscribed, setSubscribed] = useState(false);

  if (!creator) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center">Créateur non trouvé</div>;

  const handleSubscribe = () => {
    setSubscribed(true);
    alert(`✅ Abonnement activé à @${creator.username}`);
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
              <img src={creator.avatar} alt="" className="w-40 h-40 rounded-3xl border-4 border-zinc-900 object-cover" />
              {creator.verified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                  ✓ Vérifié
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 pt-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-5xl font-bold">@{creator.username}</h1>
                <p className="text-rose-400 mt-1">{creator.followers} abonnés • {creator.items} pièces</p>
              </div>
              <button
                onClick={handleSubscribe}
                disabled={subscribed}
                className={`btn-primary px-10 py-4 ${subscribed ? 'bg-zinc-800 cursor-not-allowed' : ''}`}
              >
                {subscribed ? "✓ Abonné" : "S'abonner • 9,90 €/mois"}
              </button>
            </div>

            <p className="mt-10 text-zinc-300 text-[17px] leading-relaxed">{creator.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
