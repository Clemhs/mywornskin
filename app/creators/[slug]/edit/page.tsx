'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';
import { Save, Camera } from 'lucide-react';

export default function CreatorEditPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [pendingAvatar, setPendingAvatar] = useState("");
  const [pendingBanner, setPendingBanner] = useState("");

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{message: string; type: string} | null>(null);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url, banner_url, avatar_pending_url, banner_pending_url')
        .eq('id', user.id)
        .single();

      if (data) {
        setAvatarUrl(data.avatar_url || "");
        setBannerUrl(data.banner_url || "");
        setPendingAvatar(data.avatar_pending_url || "");
        setPendingBanner(data.banner_pending_url || "");
      }
    };
    load();
  }, [user]);

  const uploadFile = async (file: File, type: 'avatar' | 'banner') => {
    if (!user) return;

    const fileName = `${user.id}-${type}-${Date.now()}.${file.name.split('.').pop()}`;

    const { error } = await supabase.storage
      .from('profiles')
      .upload(fileName, file, { upsert: true });

    if (error) {
      setToast({ message: "Erreur upload", type: "error" });
      return;
    }

    const { data: urlData } = supabase.storage.from('profiles').getPublicUrl(fileName);

    if (type === 'avatar') setPendingAvatar(urlData.publicUrl);
    else setPendingBanner(urlData.publicUrl);
  };

  const saveChanges = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        avatar_pending_url: pendingAvatar || null,
        banner_pending_url: pendingBanner || null,
      })
      .eq('id', user.id);

    if (error) {
      setToast({ message: "Erreur lors de l'enregistrement", type: "error" });
    } else {
      setToast({ message: "✅ Modifications enregistrées ! En attente de validation par l'admin.", type: "success" });
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-10">Mon profil créatrice</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Photo de profil */}
          <div>
            <p className="text-sm text-zinc-400 mb-3">Photo de profil</p>
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-zinc-700">
              <img 
                src={pendingAvatar || avatarUrl || "https://picsum.photos/id/64/400/400"} 
                className="w-full h-full object-cover" 
              />
              <label className="absolute bottom-4 right-4 bg-black/70 hover:bg-rose-600 px-5 py-2.5 rounded-2xl cursor-pointer flex items-center gap-2 text-sm">
                <Camera className="w-4 h-4" /> Changer
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'avatar')} />
              </label>
            </div>
          </div>

          {/* Photo de couverture */}
          <div>
            <p className="text-sm text-zinc-400 mb-3">Photo de couverture</p>
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-zinc-700">
              <img 
                src={pendingBanner || bannerUrl || "https://picsum.photos/id/1015/800/300"} 
                className="w-full h-full object-cover" 
              />
              <label className="absolute bottom-4 right-4 bg-black/70 hover:bg-rose-600 px-5 py-2.5 rounded-2xl cursor-pointer flex items-center gap-2 text-sm">
                <Camera className="w-4 h-4" /> Changer
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'banner')} />
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={saveChanges}
          disabled={saving}
          className="mt-12 w-full py-4 bg-rose-600 hover:bg-rose-700 disabled:bg-zinc-700 rounded-2xl text-lg font-semibold"
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
