'use client';

// V3 - Page Personnalisation avec option "Aucun" + Boutique cosmétiques

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function CreatorEdit() {
  const params = useParams();
  const id = params.id as string;

  // États
  const [avatar, setAvatar] = useState("https://picsum.photos/id/1011/280/280");
  const [banner, setBanner] = useState("https://picsum.photos/id/1005/1200/400");
  const [selectedBadge, setSelectedBadge] = useState<number | null>(10);
  const [selectedFrame, setSelectedFrame] = useState<string | null>("rose");

  // Données
  const allBadges = [
    { id: 10, unlocked: true, price: 0 },
    { id: 50, unlocked: false, price: 9 },
    { id: 100, unlocked: true, price: 0 },
    { id: 500, unlocked: false, price: 29 },
  ];

  const allFrames = [
    { id: "rose", name: "1 an", color: "rose", unlocked: true, price: 0 },
    { id: "silver", name: "2 ans", color: "silver", unlocked: true, price: 0 },
    { id: "gold", name: "5 ans", color: "gold", unlocked: false, price: 19 },
  ];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setBanner(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const buyBadge = (id: number) => {
    alert(`🛒 Badge ${id} acheté ! (simulation)`);
    // Ici plus tard : logique Stripe + mise à jour Supabase
    setSelectedBadge(id);
  };

  const buyFrame = (id: string) => {
    alert(`🛒 Cadre ${id} acheté ! (simulation)`);
    setSelectedFrame(id);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12">
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <div className="flex justify-between items-center mb-8">
          <Link href={`/creators/${id}`} className="text-zinc-400 hover:text-white flex items-center gap-2">
            ← Retour au profil
          </Link>
          <h1 className="text-3xl font-semibold">Personnaliser mon profil</h1>
          <button className="btn-primary px-8 py-3">Enregistrer tout</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Aperçu live */}
          <div className="lg:col-span-5">
            <h2 className="text-xl mb-4">Aperçu en direct</h2>
            <div className="card p-6">
              <div className="relative rounded-3xl overflow-hidden">
                <img src={banner} alt="couverture" className="w-full h-48 object-cover" />
                {selectedFrame && (
                  <div className={`shimmer-frame absolute inset-0 rounded-3xl pointer-events-none ${selectedFrame}`} />
                )}
                <div className="absolute -bottom-8 left-6">
                  <div className="relative">
                    <img src={avatar} alt="avatar" className="w-20 h-20 rounded-3xl ring-4 ring-zinc-900 object-cover" />
                    {selectedBadge && (
                      <img src={`/badges/${selectedBadge}.png`} alt="badge" className="absolute -top-1 -right-1 w-7 h-7 drop-shadow-2xl" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres */}
          <div className="lg:col-span-7 space-y-12">

            {/* Photo de couverture */}
            <div>
              <h2 className="text-xl mb-4">Image de couverture</h2>
              <div className="flex items-center gap-6">
                <img src={banner} alt="couverture" className="w-40 h-24 object-cover rounded-2xl" />
                <label className="btn-secondary cursor-pointer px-6 py-3">
                  Changer la couverture
                  <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Photo de profil */}
            <div>
              <h2 className="text-xl mb-4">Photo de profil</h2>
              <div className="flex items-center gap-6">
                <img src={avatar} alt="avatar" className="w-24 h-24 rounded-3xl object-cover ring-2 ring-zinc-700" />
                <label className="btn-secondary cursor-pointer px-6 py-3">
                  Changer la photo
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Badges */}
            <div>
              <h2 className="text-xl mb-4">Badge</h2>
              <div className="flex flex-wrap gap-4">
                {/* Option Aucun */}
                <button
                  onClick={() => setSelectedBadge(null)}
                  className={`px-6 py-3 rounded-2xl border ${selectedBadge === null ? 'border-rose-400 bg-zinc-900' : 'border-zinc-700 hover:border-zinc-500'}`}
                >
                  Aucun badge
                </button>

                {allBadges.map((badge) => (
                  <button
                    key={badge.id}
                    onClick={() => badge.unlocked && setSelectedBadge(badge.id)}
                    className={`relative w-20 aspect-square rounded-2xl overflow-hidden transition-all ${
                      !badge.unlocked ? 'grayscale opacity-40 cursor-not-allowed' : 'hover:scale-105'
                    } ${selectedBadge === badge.id ? 'ring-4 ring-rose-400' : ''}`}
                  >
                    <img src={`/badges/${badge.id}.png`} alt={`${badge.id}`} className="w-full h-full object-contain p-2" />
                    {!badge.unlocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-xs">
                        <span className="font-medium">{badge.price}€</span>
                        <button onClick={(e) => { e.stopPropagation(); buyBadge(badge.id); }} className="mt-1 text-[10px] underline">Débloquer</button>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Cadres */}
            <div>
              <h2 className="text-xl mb-4">Cadre</h2>
              <div className="flex flex-wrap gap-4">
                {/* Option Aucun */}
                <button
                  onClick={() => setSelectedFrame(null)}
                  className={`px-6 py-3 rounded-2xl border ${selectedFrame === null ? 'border-rose-400 bg-zinc-900' : 'border-zinc-700 hover:border-zinc-500'}`}
                >
                  Aucun cadre
                </button>

                {allFrames.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => frame.unlocked && setSelectedFrame(frame.id)}
                    className={`relative flex-1 min-w-[140px] rounded-3xl overflow-hidden transition-all ${
                      !frame.unlocked ? 'grayscale opacity-40 cursor-not-allowed' : 'hover:scale-105'
                    } ${selectedFrame === frame.id ? 'ring-4 ring-rose-400' : ''}`}
                  >
                    <img src={`/frames/${frame.id}-frame.png`} alt={frame.name} className="w-full aspect-video object-cover" />
                    {!frame.unlocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-xs">
                        <span className="font-medium">{frame.price}€</span>
                        <button onClick={(e) => { e.stopPropagation(); buyFrame(frame.id); }} className="mt-1 text-[10px] underline">Débloquer</button>
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 text-sm font-semibold text-white drop-shadow-md">
                      {frame.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles cadres animés */}
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
