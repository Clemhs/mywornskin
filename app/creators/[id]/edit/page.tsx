'use client';

// V4 - Spécifications upload + validation en attente (avatar & couverture)

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function CreatorEdit() {
  const params = useParams();
  const id = params.id as string;

  // États
  const [avatar, setAvatar] = useState("https://picsum.photos/id/1011/280/280");
  const [banner, setBanner] = useState("https://picsum.photos/id/1005/1200/400");
  const [avatarPending, setAvatarPending] = useState(false);
  const [bannerPending, setBannerPending] = useState(false);
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
        setAvatarPending(true); // Passage en attente de validation
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
        setBannerPending(true); // Passage en attente de validation
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12">
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <div className="flex justify-between items-center mb-8">
          <Link href={`/creators/${id}`} className="text-zinc-400 hover:text-white flex items-center gap-2">
            ← Retour au profil
          </Link>
          <h1 className="text-3xl font-semibold">Personnaliser mon profil</h1>
          <button className="btn-primary px-8 py-3">Enregistrer les modifications</button>
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

            {/* Couverture */}
            <div>
              <h2 className="text-xl mb-2">Image de couverture</h2>
              <p className="text-zinc-400 text-sm mb-4">
                Résolution recommandée : <span className="text-white">1200 × 400 px</span> • Taille max : <span className="text-white">8 Mo</span>
              </p>
              <div className="flex items-center gap-6">
                <img src={banner} alt="couverture" className="w-40 h-24 object-cover rounded-2xl" />
                <label className="btn-secondary cursor-pointer px-6 py-3">
                  Changer la couverture
                  <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                </label>
              </div>
              {bannerPending && (
                <p className="mt-3 text-amber-400 text-sm flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                  Changement en attente de validation
                </p>
              )}
            </div>

            {/* Avatar */}
            <div>
              <h2 className="text-xl mb-2">Photo de profil</h2>
              <p className="text-zinc-400 text-sm mb-4">
                Résolution recommandée : <span className="text-white">512 × 512 px</span> • Taille max : <span className="text-white">5 Mo</span>
              </p>
              <div className="flex items-center gap-6">
                <img src={avatar} alt="avatar" className="w-24 h-24 rounded-3xl object-cover ring-2 ring-zinc-700" />
                <label className="btn-secondary cursor-pointer px-6 py-3">
                  Changer la photo
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>
              {avatarPending && (
                <p className="mt-3 text-amber-400 text-sm flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                  Changement en attente de validation
                </p>
              )}
            </div>

            {/* Badges & Cadres (inchangés) */}
            {/* ... (le reste du code pour badges et cadres reste identique à la version précédente) */}

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
