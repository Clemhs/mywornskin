'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Save, Camera, ShoppingBag, Check, X, Clock, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CreatorEditPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const router = useRouter();

  const [salesBadge, setSalesBadge] = useState<number | null>(500);
  const [frame, setFrame] = useState<string | null>('gold');

  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [avatarPendingUrl, setAvatarPendingUrl] = useState("");
  const [bannerPendingUrl, setBannerPendingUrl] = useState("");

  const [avatarStatus, setAvatarStatus] = useState<'approved' | 'pending' | 'rejected'>('approved');
  const [bannerStatus, setBannerStatus] = useState<'approved' | 'pending' | 'rejected'>('approved');

  const [pendingReviews, setPendingReviews] = useState<any[]>([]);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const availableSalesBadges = [10, 50, 100, 500];
  const availableFrames = [
    { id: "rose", name: "1 an" },
    { id: "silver", name: "2 ans" },
    { id: "gold", name: "5 ans" },
  ];

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setSalesBadge(profile.sales_badge);
        setFrame(profile.frame);
        setAvatarUrl(profile.avatar_url || "");
        setBannerUrl(profile.banner_url || "");
        setAvatarPendingUrl(profile.avatar_pending_url || "");
        setBannerPendingUrl(profile.banner_pending_url || "");
        setAvatarStatus(profile.avatar_status || 'approved');
        setBannerStatus(profile.banner_status || 'approved');
      }

      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('creator_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(2);

      setPendingReviews(reviews || []);
    };

    loadData();
  }, [user]);

  const toggleSalesBadge = (level: number) => setSalesBadge(c => c === level ? null : level);
  const selectFrame = (f: string) => setFrame(c => c === f ? null : f);

  const uploadImage = async (file: File, type: 'avatar' | 'banner') => {
    if (!user) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${type}-${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error } = await supabase.storage.from('profiles').upload(filePath, file, { upsert: true });
    if (error) return null;

    const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newUrl = await uploadImage(file, 'avatar');
    if (newUrl) {
      setAvatarPendingUrl(newUrl);
      setAvatarStatus('pending');
      setToast("📸 Photo de profil envoyée en attente de validation");
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newUrl = await uploadImage(file, 'banner');
    if (newUrl) {
      setBannerPendingUrl(newUrl);
      setBannerStatus('pending');
      setToast("📸 Photo de couverture envoyée en attente de validation");
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleModerateReview = async (reviewId: string, status: 'approved' | 'rejected') => {
    await supabase.from('reviews').update({ status }).eq('id', reviewId);
    setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
    setToast(status === 'approved' ? "✅ Avis validé" : "❌ Avis rejeté");
    setTimeout(() => setToast(null), 2000);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    await supabase.from('profiles').update({
      sales_badge: salesBadge,
      frame: frame,
      avatar_pending_url: avatarPendingUrl || null,
      banner_pending_url: bannerPendingUrl || null,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id);

    setSaving(false);
    setToast("✅ Modifications enregistrées");
    setTimeout(() => router.refresh(), 800);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12 pt-20">
      <div className="max-w-6xl mx-auto px-6 pt-4">
        <div className="flex justify-between items-center mb-10">
          <Link href={`/creators/me`} className="text-zinc-400 hover:text-white flex items-center gap-2">
            ← Retour au profil
          </Link>
          <h1 className="text-3xl font-semibold">Mon profil</h1>
          <button onClick={handleSave} disabled={saving} className="bg-pink-600 hover:bg-pink-500 px-8 py-3 rounded-3xl font-medium disabled:opacity-70 flex items-center gap-2">
            <Save className="w-5 h-5" />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>

        {toast && (
          <div className={`mb-8 p-4 rounded-3xl text-center font-medium ${toast.includes('✅') ? 'bg-green-600' : 'bg-amber-600'}`}>
            {toast}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Colonne gauche - Aperçu + Commentaires (identique) */}
          <div className="lg:col-span-5 space-y-8">
            {/* ... (ton code précédent pour aperçu et commentaires à valider) */}
          </div>

          {/* Colonne droite */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <h2 className="text-xl mb-4">Changer les images</h2>
              <div className="grid grid-cols-2 gap-6">
                <label className="cursor-pointer block border border-dashed border-zinc-700 rounded-3xl p-8 text-center hover:border-pink-500 transition-all relative">
                  <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                  <Camera className="mx-auto mb-3 text-pink-400" size={32} />
                  <span className="text-pink-400 font-medium">Changer la couverture</span>
                  <p className="text-xs text-zinc-500 mt-2">Recommandé : 1200×400 px</p>
                  {bannerStatus === 'pending' && <div className="absolute top-4 right-4 text-amber-400 flex items-center gap-1"><Clock size={16} /> En attente</div>}
                  {bannerStatus === 'rejected' && <div className="absolute top-4 right-4 text-red-400 flex items-center gap-1"><AlertCircle size={16} /> Refusée</div>}
                </label>

                <label className="cursor-pointer block border border-dashed border-zinc-700 rounded-3xl p-8 text-center hover:border-pink-500 transition-all relative">
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  <Camera className="mx-auto mb-3 text-pink-400" size={32} />
                  <span className="text-pink-400 font-medium">Changer la photo de profil</span>
                  <p className="text-xs text-zinc-500 mt-2">Recommandé : 512×512 px</p>
                  {avatarStatus === 'pending' && <div className="absolute top-4 right-4 text-amber-400 flex items-center gap-1"><Clock size={16} /> En attente</div>}
                  {avatarStatus === 'rejected' && <div className="absolute top-4 right-4 text-red-400 flex items-center gap-1"><AlertCircle size={16} /> Refusée</div>}
                </label>
              </div>
            </div>

            {/* Badges, Cadres, Boutique (identiques à avant) */}
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
