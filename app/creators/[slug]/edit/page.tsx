'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Save, Camera, Lock, ShoppingBag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CreatorEditPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const router = useRouter();

  const [totalSales] = useState(999);
  const [membershipMonths] = useState(120);

  // États pour les photos
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [pendingAvatar, setPendingAvatar] = useState<string>("");
  const [pendingBanner, setPendingBanner] = useState<string>("");

  // États pour badges et cadres
  const [salesBadge, setSalesBadge] = useState<number | null>(500);
  const [frame, setFrame] = useState<string | null>('gold');

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Chargement des données actuelles
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url, banner_url, avatar_pending_url, banner_pending_url, sales_badge, frame')
        .eq('id', user.id)
        .single();

      if (data) {
        setAvatarUrl(data.avatar_url || "");
        setBannerUrl(data.banner_url || "");
        setPendingAvatar(data.avatar_pending_url || "");
        setPendingBanner(data.banner_pending_url || "");
        setSalesBadge(data.sales_badge);
        setFrame(data.frame);
      }
    };

    loadProfile();
  }, [user]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const uploadImage = async (file: File, type: 'avatar' | 'banner') => {
    if (!user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${type}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('profiles')
      .upload(fileName, file, { upsert: true });

    if (error) {
      showToast("Erreur lors de l'upload", 'error');
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file, 'avatar');
    if (url) setPendingAvatar(url);
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file, 'banner');
    if (url) setPendingBanner(url);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        avatar_pending_url: pendingAvatar || null,
        banner_pending_url: pendingBanner || null,
        avatar_status: pendingAvatar ? 'pending' : 'approved',
        banner_status: pendingBanner ? 'pending' : 'approved',
        sales_badge: salesBadge,
        frame: frame,
      })
      .eq('id', user.id);

    if (error) {
      showToast("Erreur lors de la sauvegarde", 'error');
    } else {
      showToast("✅ Modifications enregistrées avec succès !", 'success');
      // Recharger les données
      window.location.reload();
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      {/* Header déjà dans le layout */}

      <div className="max-w-5xl mx-auto px-6 pt-20">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Édition de profil</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 bg-rose-500 hover:bg-rose-600 px-8 py-4 rounded-2xl font-semibold disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "Enregistrement..." : "Enregistrer tout"}
          </button>
        </div>

        {/* Photos */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Avatar */}
          <div>
            <label className="block text-sm text-zinc-400 mb-3">Photo de profil</label>
            <div className="relative w-64 h-64 mx-auto">
              <img
                src={pendingAvatar || avatarUrl || "https://picsum.photos/id/64/300/300"}
                alt="Avatar"
                className="w-full h-full object-cover rounded-3xl border-4 border-zinc-800"
              />
              {pendingAvatar && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-3xl">
                  <p className="text-rose-400 text-sm font-medium">En attente de validation</p>
                </div>
              )}
            </div>
            <label className="block mt-4 text-center cursor-pointer text-rose-400 hover:text-rose-500">
              Changer la photo de profil
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>

          {/* Bannière */}
          <div>
            <label className="block text-sm text-zinc-400 mb-3">Photo de couverture</label>
            <div className="relative h-48 bg-zinc-900 rounded-3xl overflow-hidden">
              <img
                src={pendingBanner || bannerUrl || "https://picsum.photos/id/1015/800/300"}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              {pendingBanner && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <p className="text-rose-400 text-sm font-medium">En attente de validation</p>
                </div>
              )}
            </div>
            <label className="block mt-4 text-center cursor-pointer text-rose-400 hover:text-rose-500">
              Changer la photo de couverture
              <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Badges & Cadres + Boutique (je te remets tout le reste si tu veux) */}

        {toast && (
          <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
