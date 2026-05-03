'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CreatorEditPage() {
  const params = useParams();
  const id = params.id as string;

  const [avatar, setAvatar] = useState("https://picsum.photos/id/1011/280/280");
  const [banner, setBanner] = useState("https://picsum.photos/id/1005/1200/400");
  const [pendingAvatar, setPendingAvatar] = useState("");
  const [pendingBanner, setPendingBanner] = useState("");
  const [avatarStatus, setAvatarStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [bannerStatus, setBannerStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [selectedBadge, setSelectedBadge] = useState<number | null>(10);
  const [selectedFrame, setSelectedFrame] = useState<string | null>("rose");
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [salesCount, setSalesCount] = useState(0);
  const [yearsOld, setYearsOld] = useState(0);

  useEffect(() => {
    // Simulation (à remplacer par Supabase)
    setSalesCount(47);
    setYearsOld(1);
  }, [id]);

  const allBadges = [
    { id: 10, unlocked: salesCount >= 10, label: "10 ventes" },
    { id: 50, unlocked: salesCount >= 50, label: "50 ventes" },
    { id: 100, unlocked: salesCount >= 100, label: "100 ventes" },
    { id: 500, unlocked: salesCount >= 500, label: "500 ventes" },
  ];

  const allFrames = [
    { id: "rose", name: "1 an", unlocked: yearsOld >= 1, label: "1 an d'inscription" },
    { id: "silver", name: "2 ans", unlocked: yearsOld >= 2, label: "2 ans d'inscription" },
    { id: "gold", name: "5 ans", unlocked: yearsOld >= 5, label: "5 ans d'inscription" },
  ];

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPendingAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
    setAvatarStatus('pending');
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPendingBanner(ev.target?.result as string);
    reader.readAsDataURL(file);
    setBannerStatus('pending');
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setToastMessage("✅ Profil mis à jour avec succès !");
      setSaving(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12 pt-20">
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex justify-between items-center mb-6">
          <Link href={`/creators/${id}`} className="text-zinc-400 hover:text-white flex flex-col text-xs leading-none">
            <span>Retour</span>
            <span>au profil</span>
          </Link>
          <h1 className="text-2xl font-semibold">Mon profil</h1>
          <button onClick={handleSave} disabled={saving} className="bg-pink-600 hover:bg-pink-500 px-6 py-2.5 rounded-3xl text-sm font-medium disabled:opacity-50">
            {saving ? '...' : 'Enregistrer'}
          </button>
        </div>

        {rejectionMessage && (
          <div className="bg-red-900/30 border border-red-500 text-red-400 p-4 rounded-3xl mb-8 text-sm">
            ⚠️ {rejectionMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Aperçu en direct */}
          <div className="lg:col-span-5">
            <h2 className="text-xl mb-4">Aperçu en direct</h2>
            <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-video">
              <img src={pendingBanner || banner} alt="Bannière" className="w-full h-full object-cover" />
              {selectedFrame && <div className={`shimmer-frame absolute inset-0 rounded-3xl pointer-events-none ${selectedFrame}`} />}
              <div className="absolute bottom-8 left-8 flex items-end gap-6">
                <div className="relative">
                  <img src={pendingAvatar || avatar} alt="Avatar" className="w-28 h-28 rounded-2xl border-4 border-zinc-950 object-cover" />
                  {selectedBadge && <img src={`/badges/${selectedBadge}.png`} alt="badge" className="absolute -top-2 -right-2 w-9 h-9 drop-shadow-2xl" />}
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres */}
          <div className="lg:col-span-7 space-y-12">
            {/* Uploads */}
            <div>
              <h2 className="text-xl mb-4">Changer les images</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Image de couverture</p>
                  <label className="cursor-pointer block border border-dashed border-zinc-700 rounded-3xl p-8 text-center hover:border-pink-500">
                    <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                    <span className="text-pink-400">Changer la couverture</span>
                  </label>
                  {bannerStatus === 'pending' && <p className="text-amber-400 text-sm mt-2">En attente de validation</p>}
                </div>
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Photo de profil</p>
                  <label className="cursor-pointer block border border-dashed border-zinc-700 rounded-3xl p-8 text-center hover:border-pink-500">
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    <span className="text-pink-400">Changer la photo</span>
                  </label>
                  {avatarStatus === 'pending' && <p className="text-amber-400 text-sm mt-2">En attente de validation</p>}
                </div>
              </div>
            </div>

            {/* Badges */}
            <div>
              <h2 className="text-xl mb-4">Badges</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {allBadges.map(b => (
                  <button
                    key={b.id}
                    onClick={() => b.unlocked && setSelectedBadge(b.id)}
                    className={`flex-shrink-0 relative w-20 aspect-square rounded-2xl overflow-hidden border flex flex-col items-center justify-center ${selectedBadge === b.id ? 'border-pink-400 ring-2 ring-pink-400/50' : 'border-zinc-700'} ${!b.unlocked ? 'grayscale opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <img src={`/badges/${b.id}.png`} className="w-16 h-16 object-contain" />
                    {!b.unlocked && <div className="absolute top-2 right-2 text-lg">🔒</div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Cadres */}
            <div>
              <h2 className="text-xl mb-4">Cadres</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {allFrames.map(f => (
                  <button
                    key={f.id}
                    onClick={() => f.unlocked && setSelectedFrame(f.id)}
                    className={`flex-shrink-0 relative w-28 h-20 rounded-2xl overflow-hidden border flex flex-col items-center justify-center ${selectedFrame === f.id ? 'border-pink-400 ring-2 ring-pink-400/50' : 'border-zinc-700'} ${!f.unlocked ? 'grayscale opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <div className={`shimmer-frame w-24 h-14 rounded-xl ${f.id}`} />
                    <span className="absolute text-xs font-medium bottom-1 text-white drop-shadow-md">
                      {f.name}
                    </span>
                    {!f.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-xs text-white">🔒</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-8 py-4 rounded-3xl shadow-2xl z-50">
          {toastMessage}
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 300% 0; } }
        .shimmer-frame { animation: shimmer 10s linear infinite; background: linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.85) 50%, transparent 60%); background-size: 200% 100%; box-shadow: 0 0 20px -3px currentColor, inset 0 0 20px -3px currentColor; }
        .shimmer-frame.rose { color: #f472b6; }
        .shimmer-frame.silver { color: #e2e8f0; }
        .shimmer-frame.gold { color: #fbbf24; }
      `}</style>
    </div>
  );
}
