'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Save, Lock, Camera, ShoppingBag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CreatorEditPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [totalSales] = useState(999);
  const [membershipMonths] = useState(120);
  const [salesBadge, setSalesBadge] = useState<number | null>(500);
  const [frame, setFrame] = useState<string | null>('gold');

  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [pendingAvatar, setPendingAvatar] = useState("");
  const [pendingBanner, setPendingBanner] = useState("");

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const availableSalesBadges = [10, 50, 100, 500];
  const availableFrames = [
    { id: "rose", name: "1 an" },
    { id: "silver", name: "2 ans" },
    { id: "gold", name: "5 ans" },
  ];

  // Chargement
  useEffect(() => {
    if (!user) return;
  }, [user]);

  const toggleSalesBadge = (level: number) => {
    setSalesBadge(current => current === level ? null : level);
  };

  const selectFrame = (f: string) => {
    setFrame(current => current === f ? null : f);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPendingAvatar(URL.createObjectURL(file));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPendingBanner(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setToast(null);

    const updateData: any = {
      sales_badge: salesBadge,
      frame: frame,
      updated_at: new Date().toISOString(),
    };

    if (pendingAvatar) updateData.avatar_url = pendingAvatar;
    if (pendingBanner) updateData.banner_url = pendingBanner;

    console.log("Sauvegarde avec :", updateData);

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      console.error(error);
      setToast("❌ Erreur lors de l'enregistrement");
    } else {
      setToast("✅ Modifications enregistrées avec succès !");
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12 pt-20">
      <div className="max-w-6xl mx-auto px-6 pt-4">
        <div className="flex justify-between items-center mb-10">
          <Link href={`/creators/me`} className="text-zinc-400 hover:text-white flex items-center gap-2">
            ← Retour au profil
          </Link>
          <h1 className="text-3xl font-semibold">Mon profil</h1>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-pink-600 hover:bg-pink-500 px-8 py-3 rounded-3xl font-medium disabled:opacity-70 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>

        {toast && (
          <div className={`mb-8 p-4 rounded-3xl text-center font-medium ${toast.includes('✅') ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Aperçu en direct */}
          <div className="lg:col-span-5">
            <h2 className="text-xl mb-4">Aperçu en direct</h2>
            <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-video">
              <img src={pendingBanner || bannerUrl || "https://picsum.photos/id/1015/1200/400"} alt="Bannière" className="w-full h-full object-cover" />
              <div className="absolute bottom-8 left-8">
                <div className="relative">
                  <img 
                    src={pendingAvatar || avatarUrl || "https://picsum.photos/id/64/300/300"} 
                    alt="Avatar" 
                    className="w-32 h-32 rounded-2xl border-4 border-zinc-950 object-cover" 
                  />
                  {frame && <div className={`absolute inset-0 rounded-2xl border-4 shimmer-frame ${frame}`} />}
                  {salesBadge && <img src={`/badges/${salesBadge}.png`} className="absolute -top-3 -right-3 w-12 h-12 drop-shadow-2xl z-10" />}
                </div>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="lg:col-span-7 space-y-12">
            {/* Upload Images */}
            <div>
              <h2 className="text-xl mb-4">Changer les images</h2>
              <div className="grid grid-cols-2 gap-6">
                <label className="cursor-pointer block border border-dashed border-zinc-700 rounded-3xl p-8 text-center hover:border-pink-500 transition-all">
                  <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                  <Camera className="mx-auto mb-3 text-pink-400" size={32} />
                  <span className="text-pink-400 font-medium">Changer la couverture</span>
                  <p className="text-xs text-zinc-500 mt-2">Recommandé : 1200×400 px</p>
                </label>

                <label className="cursor-pointer block border border-dashed border-zinc-700 rounded-3xl p-8 text-center hover:border-pink-500 transition-all">
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  <Camera className="mx-auto mb-3 text-pink-400" size={32} />
                  <span className="text-pink-400 font-medium">Changer la photo de profil</span>
                  <p className="text-xs text-zinc-500 mt-2">Recommandé : 512×512 px (carrée)</p>
                </label>
              </div>
            </div>

            {/* Badges de ventes */}
            <div>
              <h2 className="text-xl mb-4">Badges de ventes</h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {availableSalesBadges.map(level => {
                  const isSelected = salesBadge === level;
                  return (
                    <button key={level} onClick={() => toggleSalesBadge(level)} className={`flex-shrink-0 w-28 h-28 rounded-3xl flex flex-col items-center justify-center border-2 transition-all relative ${isSelected ? 'border-pink-400 bg-pink-900/30' : 'border-zinc-700 hover:border-pink-400'}`}>
                      <img src={`/badges/${level}.png`} className="w-14 h-14 mb-1" />
                      <span className="text-sm">{level} ventes</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cadres */}
            <div>
              <h2 className="text-xl mb-4">Cadres d'ancienneté</h2>
              <div className="flex gap-6 overflow-x-auto pb-6">
                {availableFrames.map(f => {
                  const isSelected = frame === f.id;
                  return (
                    <button key={f.id} onClick={() => selectFrame(f.id)} className={`flex-shrink-0 relative w-28 h-28 rounded-3xl overflow-hidden border-2 transition-all ${isSelected ? 'border-pink-400 scale-95' : 'border-zinc-700 hover:border-pink-400'}`}>
                      <div className={`shimmer-frame absolute inset-0 rounded-3xl ${f.id}`} />
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black/80 text-xs px-3 py-1 rounded-full">
                        {f.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Boutique cosmétiques */}
            <div>
              <h2 className="text-xl mb-4 flex items-center gap-2">
                <ShoppingBag className="text-pink-400" /> Boutique cosmétiques
              </h2>
              <div className="bg-zinc-900 rounded-3xl p-8">
                <p className="text-zinc-400 mb-6">Débloquez de nouveaux badges et cadres exclusifs</p>
                <div className="space-y-4">
                  <button onClick={() => setSalesBadge(500)} className="w-full bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl flex justify-between items-center">
                    <span>🎖️ Badge Légende (500 ventes)</span>
                    <span className="text-pink-400">9,99€</span>
                  </button>
                  <button onClick={() => setFrame('gold')} className="w-full bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl flex justify-between items-center">
                    <span>✨ Cadre Diamant</span>
                    <span className="text-pink-400">14,99€</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer-frame { 0% { background-position: -200% 0; } 100% { background-position: 300% 0; } }
        .shimmer-frame { animation: shimmer-frame 8s linear infinite; background: linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.85) 50%, transparent 60%); background-size: 200% 100%; }
        .shimmer-frame.rose { border-color: #f472b6; box-shadow: inset 0 0 40px #f472b6; }
        .shimmer-frame.silver { border-color: #e2e8f0; box-shadow: inset 0 0 40px #e2e8f0; }
        .shimmer-frame.gold { border-color: #fbbf24; box-shadow: inset 0 0 45px #fbbf24; }
      `}</style>
    </div>
  );
}
