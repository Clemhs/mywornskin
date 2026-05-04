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

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const availableSalesBadges = [10, 50, 100, 500];
  const availableFrames = [
    { id: "rose", name: "1 an" },
    { id: "silver", name: "2 ans" },
    { id: "gold", name: "5 ans" },
  ];

  // Chargement initial
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('sales_badge, frame, avatar_url, banner_url')
        .eq('id', user.id)
        .single();

      if (data) {
        setSalesBadge(data.sales_badge);
        setFrame(data.frame);
        setAvatarUrl(data.avatar_url || "");
        setBannerUrl(data.banner_url || "");
      }
    };

    loadProfile();
  }, [user]);

  const toggleSalesBadge = (level: number) => {
    setSalesBadge(current => current === level ? null : level);
  };

  const selectFrame = (f: string) => {
    setFrame(current => current === f ? null : f);
  };

  // Upload réel vers Supabase Storage
  const uploadImage = async (file: File, type: 'avatar' | 'banner') => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${type}-${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newUrl = await uploadImage(file, 'avatar');
    if (newUrl) {
      setAvatarUrl(newUrl);
      setToast("✅ Photo de profil mise à jour");
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newUrl = await uploadImage(file, 'banner');
    if (newUrl) {
      setBannerUrl(newUrl);
      setToast("✅ Couverture mise à jour");
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        sales_badge: salesBadge,
        frame: frame,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      setToast("❌ Erreur lors de l'enregistrement");
    } else {
      setToast("✅ Tout a été enregistré avec succès !");
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
              <img src={bannerUrl || "https://picsum.photos/id/1015/1200/400"} alt="Bannière" className="w-full h-full object-cover" />
              <div className="absolute bottom-8 left-8">
                <div className="relative">
                  <img 
                    src={avatarUrl || "https://picsum.photos/id/64/300/300"} 
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

            {/* Badges, Cadres, Boutique... (identique à avant) */}
            {/* Tu peux copier-coller les sections badges, cadres et boutique de ta version précédente */}

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
