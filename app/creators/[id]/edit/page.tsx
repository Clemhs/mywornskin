'use client';

// V6 - Statut visible (En attente / Validé / Refusé) + tout le reste

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function CreatorEdit() {
  const params = useParams();
  const id = params.id as string;

  const [avatar, setAvatar] = useState("https://picsum.photos/id/1011/280/280");
  const [banner, setBanner] = useState("https://picsum.photos/id/1005/1200/400");
  const [avatarStatus, setAvatarStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [bannerStatus, setBannerStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<number | null>(10);
  const [selectedFrame, setSelectedFrame] = useState<string | null>("rose");

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
      reader.onload = (ev) => {
        setAvatar(ev.target?.result as string);
        setAvatarStatus('pending');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setBanner(ev.target?.result as string);
        setBannerStatus('pending');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Link href={`/creators/${id}`} className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm">← Retour au profil</Link>
          <h1 className="text-2xl font-semibold text-center sm:text-left">Personnaliser mon profil</h1>
          <button className="btn-primary px-8 py-3 text-sm sm:text-base">Enregistrer les modifications</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Aperçu live */}
          <div className="lg:col-span-5">
            <h2 className="text-xl mb-4">Aperçu en direct</h2>
            <div className="card p-6">
              <div className="relative rounded-3xl overflow-hidden">
                <img src={banner} alt="couverture" className="w-full h-48 object-cover" />
                {selectedFrame && <div className={`shimmer-frame absolute inset-0 rounded-3xl pointer-events-none ${selectedFrame}`} />}
                <div className="absolute -bottom-8 left-6">
                  <div className="relative">
                    <img src={avatar} alt="avatar" className="w-20 h-20 rounded-3xl ring-4 ring-zinc-900 object-cover" />
                    {selectedBadge && <img src={`/badges/${selectedBadge}.png`} alt="badge" className="absolute -top-1 -right-1 w-7 h-7 drop-shadow-2xl" />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres */}
          <div className="lg:col-span-7 space-y-12">

            {/* Couverture */}
            <div>
              <h2 className="text-xl mb-2">Image de couverture</h2>
              <p className="text-zinc-400 text-sm mb-4">1200 × 400 px • Max 8 Mo</p>
              <div className="flex items-center gap-6">
                <img src={banner} alt="couverture" className="w-40 h-24 object-cover rounded-2xl" />
                <label className="btn-secondary cursor-pointer px-6 py-3">Changer la couverture<input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" /></label>
              </div>
              {bannerStatus === 'pending' && <p className="mt-3 text-amber-400 text-sm flex items-center gap-2">⏳ En attente de validation</p>}
              {bannerStatus === 'approved' && <p className="mt-3 text-green-400 text-sm flex items-center gap-2">✅ Validé</p>}
              {bannerStatus === 'rejected' && <p className="mt-3 text-red-400 text-sm flex items-center gap-2">❌ Refusé</p>}
            </div>

            {/* Avatar */}
            <div>
              <h2 className="text-xl mb-2">Photo de profil</h2>
              <p className="text-zinc-400 text-sm mb-4">512 × 512 px • Max 5 Mo</p>
              <div className="flex items-center gap-6">
                <img src={avatar} alt="avatar" className="w-24 h-24 rounded-3xl object-cover ring-2 ring-zinc-700" />
                <label className="btn-secondary cursor-pointer px-6 py-3">Changer la photo<input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" /></label>
              </div>
              {avatarStatus === 'pending' && <p className="mt-3 text-amber-400 text-sm flex items-center gap-2">⏳ En attente de validation</p>}
              {avatarStatus === 'approved' && <p className="mt-3 text-green-400 text-sm flex items-center gap-2">✅ Validé</p>}
              {avatarStatus === 'rejected' && <p className="mt-3 text-red-400 text-sm flex items-center gap-2">❌ Refusé</p>}
            </div>

            {/* Badges */}
            <div>
              <h2 className="text-xl mb-4">Badge</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                <button onClick={() => setSelectedBadge(null)} className={`flex-shrink-0 px-6 py-3 rounded-2xl border whitespace-nowrap ${selectedBadge === null ? 'border-rose-400 bg-zinc-900' : 'border-zinc-700 hover:border-zinc-500'}`}>Aucun badge</button>
                {allBadges.map(b => (
                  <button key={b.id} onClick={() => b.unlocked && setSelectedBadge(b.id)} className={`flex-shrink-0 relative w-20 aspect-square rounded-2xl overflow-hidden transition-all snap-center ${!b.unlocked ? 'grayscale opacity-40 cursor-not-allowed' : 'hover:scale-105'} ${selectedBadge === b.id ? 'ring-4 ring-rose-400' : ''}`}>
                    <img src={`/badges/${b.id}.png`} className="w-full h-full object-contain p-2" />
                    {!b.unlocked && <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-xs"><span>{b.price}€</span><span className="underline text-[10px]">Débloquer</span></div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Cadres */}
            <div>
              <h2 className="text-xl mb-4">Cadre</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                <button onClick={() => setSelectedFrame(null)} className={`flex-shrink-0 px-6 py-3 rounded-2xl border whitespace-nowrap ${selectedFrame === null ? 'border-rose-400 bg-zinc-900' : 'border-zinc-700 hover:border-zinc-500'}`}>Aucun cadre</button>
                {allFrames.map(f => (
                  <button key={f.id} onClick={() => f.unlocked && setSelectedFrame(f.id)} className={`flex-shrink-0 relative flex-1 min-w-[160px] rounded-3xl overflow-hidden transition-all snap-center ${!f.unlocked ? 'grayscale opacity-40 cursor-not-allowed' : 'hover:scale-105'} ${selectedFrame === f.id ? 'ring-4 ring-rose-400' : ''}`}>
                    <img src={`/frames/${f.id}-frame.png`} className="w-full aspect-video object-cover" />
                    {!f.unlocked && <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-xs"><span>{f.price}€</span><span className="underline text-[10px]">Débloquer</span></div>}
                    <div className="absolute bottom-3 right-3 text-sm font-semibold text-white drop-shadow-md">{f.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Boutique cosmétiques (restaurée) */}
            <div className="pt-8 border-t border-zinc-800">
              <h2 className="text-2xl font-semibold mb-2">Boutique cosmétiques</h2>
              <p className="text-zinc-400 mb-6">Débloque des badges et cadres exclusifs</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "Badge 250", price: 15, type: "badge" },
                  { name: "Badge 1000", price: 39, type: "badge" },
                  { name: "Cadre Platine", price: 49, type: "frame" },
                  { name: "Cadre Émeraude", price: 29, type: "frame" },
                  { name: "Badge Diamant", price: 59, type: "badge" },
                  { name: "Cadre Rubis", price: 35, type: "frame" },
                  { name: "Badge Légende", price: 79, type: "badge" },
                  { name: "Cadre Obsidienne", price: 45, type: "frame" },
                ].map((item, i) => (
                  <div key={i} className="card p-4 hover:scale-105 transition-all cursor-pointer group">
                    <div className="h-40 bg-zinc-900 rounded-2xl flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform">
                      {item.type === "badge" ? "🏆" : "🖼️"}
                    </div>
                    <p className="font-medium text-center">{item.name}</p>
                    <p className="text-rose-400 text-xl text-center mt-1">{item.price}€</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 300% 0; } }
        .shimmer-frame { animation: shimmer 10s linear infinite; background: linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.85) 50%, transparent 60%); background-size: 200% 100%; box-shadow: 0 0 20px -3px currentColor, inset 0 0 20px -3px currentColor; }
        .shimmer-frame.rose { color: #f472b6; }
        .shimmer-frame.silver { color: #e2e8f0; }
        .shimmer-frame.gold { color: #fbbf24; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
