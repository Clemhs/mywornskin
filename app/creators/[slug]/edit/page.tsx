'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Save, Camera, Lock, ShoppingBag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CreatorEditPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [totalSales] = useState(999);
  const [membershipMonths] = useState(120);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [pendingAvatar, setPendingAvatar] = useState("");
  const [pendingBanner, setPendingBanner] = useState("");

  const [salesBadge, setSalesBadge] = useState<number | null>(500);
  const [frame, setFrame] = useState<string | null>('gold');

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Chargement initial
  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
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

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Upload photo + mise en attente automatique
  const uploadAndSavePhoto = async (file: File, type: 'avatar' | 'banner') => {
    if (!user) return;
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${type}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from('profiles').upload(fileName, file, { upsert: true });
    if (error) return showToast("Erreur d'upload", 'error');

    const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);

    const updateData = type === 'avatar' 
      ? { avatar_pending_url: publicUrl, avatar_status: 'pending' }
      : { banner_pending_url: publicUrl, banner_status: 'pending' };

    await supabase.from('profiles').update(updateData).eq('id', user.id);

    if (type === 'avatar') setPendingAvatar(publicUrl);
    else setPendingBanner(publicUrl);

    showToast(`Photo envoyée en attente de validation`, 'success');
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    await supabase
      .from('profiles')
      .update({ 
        sales_badge: salesBadge, 
        frame 
      })
      .eq('id', user.id);

    showToast("✅ Badges et cadres enregistrés avec succès", 'success');
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-20">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Édition de profil</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 bg-rose-500 hover:bg-rose-600 px-8 py-4 rounded-2xl font-semibold disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "Enregistrement..." : "Enregistrer badges & cadres"}
          </button>
        </div>

        {/* === PHOTOS === */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div className="text-center">
            <p className="text-zinc-400 mb-4">Photo de profil</p>
            <div className="relative w-64 h-64 mx-auto rounded-3xl overflow-hidden border-4 border-zinc-800">
              <img src={pendingAvatar || avatarUrl || "https://picsum.photos/id/64/300/300"} className="w-full h-full object-cover" />
              {pendingAvatar && <div className="absolute inset-0 bg-black/70 flex items-center justify-center"><p className="text-rose-400">En attente de validation</p></div>}
            </div>
            <label className="mt-6 block text-rose-400 cursor-pointer hover:text-rose-500">
              Changer photo de profil
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadAndSavePhoto(e.target.files[0], 'avatar')} className="hidden" />
            </label>
          </div>

          <div className="text-center">
            <p className="text-zinc-400 mb-4">Photo de couverture</p>
            <div className="relative h-64 bg-zinc-900 rounded-3xl overflow-hidden">
              <img src={pendingBanner || bannerUrl || "https://picsum.photos/id/1015/800/300"} className="w-full h-full object-cover" />
              {pendingBanner && <div className="absolute inset-0 bg-black/70 flex items-center justify-center"><p className="text-rose-400">En attente de validation</p></div>}
            </div>
            <label className="mt-6 block text-rose-400 cursor-pointer hover:text-rose-500">
              Changer photo de couverture
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadAndSavePhoto(e.target.files[0], 'banner')} className="hidden" />
            </label>
          </div>
        </div>

        {/* Badges de ventes */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Badges de ventes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[10, 50, 100, 500].map(level => (
              <button
                key={level}
                onClick={() => setSalesBadge(level)}
                className={`p-6 rounded-3xl border-2 transition-all ${salesBadge === level ? 'border-rose-500 bg-zinc-900' : 'border-zinc-700 hover:border-zinc-500'}`}
              >
                <div className="text-4xl mb-2">🏆</div>
                <div className="font-semibold">{level} ventes</div>
              </button>
            ))}
          </div>
        </div>

        {/* Cadres */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Cadres de profil</h2>
          <div className="grid grid-cols-3 gap-6">
            {['rose', 'silver', 'gold'].map(f => (
              <button
                key={f}
                onClick={() => setFrame(f)}
                className={`h-32 rounded-3xl border-4 flex items-center justify-center text-xl font-medium transition-all ${frame === f ? 'border-rose-500 scale-105' : 'border-zinc-700'}`}
              >
                Cadre {f}
              </button>
            ))}
          </div>
        </div>

        {/* Boutique cosmétique */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Boutique cosmétique</h2>
          <div className="bg-zinc-900 rounded-3xl p-10 text-center">
            <p className="text-zinc-400 mb-6">Prochainement disponible : badges et cadres à acheter</p>
            <div className="inline-block bg-zinc-800 px-8 py-4 rounded-2xl text-rose-400 font-medium">
              Boutique bientôt active
            </div>
          </div>
        </div>

        {toast && (
          <div className={`fixed bottom-8 right-8 px-8 py-4 rounded-2xl text-lg ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
