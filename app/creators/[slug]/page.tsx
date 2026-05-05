'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';
import { Save, Camera, Lock } from 'lucide-react';

export default function CreatorEditPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [pendingAvatar, setPendingAvatar] = useState("");
  const [pendingBanner, setPendingBanner] = useState("");

  const [salesBadge, setSalesBadge] = useState<number | null>(null);
  const [frame, setFrame] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);

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
  }, [user, supabase]);

  const handleFileUpload = async (file: File, type: 'avatar' | 'banner') => {
    if (!user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${type}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('profiles')
      .upload(fileName, file, { upsert: true });

    if (error) {
      setToast({ message: "Erreur lors de l'upload", type: 'error' });
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);

    if (type === 'avatar') {
      setPendingAvatar(publicUrl);
    } else {
      setPendingBanner(publicUrl);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);

    const updates: any = {};

    if (pendingAvatar) updates.avatar_pending_url = pendingAvatar;
    if (pendingBanner) updates.banner_pending_url = pendingBanner;
    if (salesBadge !== null) updates.sales_badge = salesBadge;
    if (frame) updates.frame = frame;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      setToast({ message: "Erreur lors de l'enregistrement", type: 'error' });
    } else {
      setToast({ message: "✅ Profil mis à jour ! En attente de validation.", type: 'success' });
      // Reset pending
      if (pendingAvatar) setAvatarUrl(pendingAvatar);
      if (pendingBanner) setBannerUrl(pendingBanner);
      setPendingAvatar("");
      setPendingBanner("");
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-10">Mon profil créatrice</h1>

        {/* Photos */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <label className="block text-sm text-zinc-400 mb-3">Photo de profil</label>
            <div className="relative">
              <img src={pendingAvatar || avatarUrl || "https://picsum.photos/id/64/300/300"} className="w-full aspect-square object-cover rounded-3xl" />
              <label className="absolute bottom-4 right-4 bg-black/70 hover:bg-rose-600 px-4 py-2 rounded-2xl cursor-pointer flex items-center gap-2 text-sm">
                <Camera className="w-4 h-4" /> Changer
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'avatar')} />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-3">Photo de couverture</label>
            <div className="relative">
              <img src={pendingBanner || bannerUrl || "https://picsum.photos/id/1015/800/300"} className="w-full aspect-video object-cover rounded-3xl" />
              <label className="absolute bottom-4 right-4 bg-black/70 hover:bg-rose-600 px-4 py-2 rounded-2xl cursor-pointer flex items-center gap-2 text-sm">
                <Camera className="w-4 h-4" /> Changer
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'banner')} />
              </label>
            </div>
          </div>
        </div>

        {/* Badges & Cadres (à compléter si besoin) */}

        <button
          onClick={saveProfile}
          disabled={saving}
          className="w-full py-4 bg-rose-600 hover:bg-rose-700 rounded-2xl font-semibold text-lg disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>

        {toast && (
          <div className={`mt-6 p-4 rounded-2xl text-center ${toast.type === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
