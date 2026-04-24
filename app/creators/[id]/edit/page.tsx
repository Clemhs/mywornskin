'use client';
// V10 - Version complète et robuste
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function CreatorEdit() {
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
  const [saving, setSaving] = useState(false);   // ← Ajouté

  // Chargement des données
  useEffect(() => {
    const loadCreator = async () => {
      if (!id) return;
      const { data } = await supabase
        .from('creators')
        .select('avatar_url, banner_url, pending_avatar_url, pending_banner_url')
        .eq('id', id)
        .single();
      if (data) {
        setAvatar(data.avatar_url || "https://picsum.photos/id/1011/280/280");
        setBanner(data.banner_url || "https://picsum.photos/id/1005/1200/400");
        setPendingAvatar(data.pending_avatar_url || "");
        setPendingBanner(data.pending_banner_url || "");
        if (data.pending_avatar_url) setAvatarStatus('pending');
        if (data.pending_banner_url) setBannerStatus('pending');
      }
    };
    loadCreator();
  }, [id]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarStatus('pending');
    const fileExt = file.name.split('.').pop();
    const fileName = `pending-avatar-${id}-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });
    if (error) {
      console.error(error);
      setAvatarStatus('rejected');
      return;
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    setPendingAvatar(data.publicUrl);
    await supabase
      .from('creators')
      .update({ pending_avatar_url: data.publicUrl })
      .eq('id', id);
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerStatus('pending');
    const fileExt = file.name.split('.').pop();
    const fileName = `pending-banner-${id}-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from('banners')
      .upload(fileName, file, { upsert: true });
    if (error) {
      console.error(error);
      setBannerStatus('rejected');
      return;
    }
    const { data } = supabase.storage.from('banners').getPublicUrl(fileName);
    setPendingBanner(data.publicUrl);
    await supabase
      .from('creators')
      .update({ pending_banner_url: data.publicUrl })
      .eq('id', id);
  };

  // Fonction ajoutée pour que le bouton fonctionne
  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from('creators')
      .update({
        badge: selectedBadge,
        frame: selectedFrame
      })
      .eq('id', id);

    if (error) {
      console.error(error);
    } else {
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed; bottom:24px; right:24px; background:#10b981; color:white; padding:16px 24px; border-radius:9999px; box-shadow:0 10px 15px -3px rgb(0 0 0 / 0.3); z-index:9999;';
      toast.textContent = '✅ Modifications enregistrées avec succès';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 4000);
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Link href={`/creators/${id}`} className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm">← Retour au profil</Link>
          <h1 className="text-2xl font-semibold text-center sm:text-left">Personnaliser mon profil</h1>
          
          {/* Bouton corrigé */}
          <button 
            onClick={handleSave}
            disabled={saving}
            className="btn-primary px-8 py-3 text-sm sm:text-base"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Aperçu live */}
          <div className="lg:col-span-5">
            <h2 className="text-xl mb-4">Aperçu en direct</h2>
            <div className="card p-6">
              <div className="relative rounded-3xl overflow-hidden">
                <img src={pendingBanner || banner} alt="couverture" className="w-full h-48 object-cover" />
                {selectedFrame && <div className={`shimmer-frame absolute inset-0 rounded-3xl pointer-events-none ${selectedFrame}`} />}
                <div className="absolute -bottom-8 left-6">
                  <div className="relative">
                    <img src={pendingAvatar || avatar} alt="avatar" className="w-20 h-20 rounded-3xl ring-4 ring-zinc-900 object-cover" />
                    {selectedBadge && <img src={`/badges/${selectedBadge}.png`} alt="badge" className="absolute -top-1 -right-1 w-7 h-7 drop-shadow-2xl" />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tout le reste de ton code (couverture, avatar, badges, cadres, boutique) est identique */}
          {/* Paramètres */}
          <div className="lg:col-span-7 space-y-12">
            {/* Couverture */}
            <div>
              <h2 className="text-xl mb-2">Image de couverture</h2>
              <p className="text-zinc-400 text-sm mb-4">1200 × 400 px • Max 8 Mo</p>
              <div className="flex items-center gap-6">
                <img src={pendingBanner || banner} alt="couverture" className="w-40 h-24 object-cover rounded-2xl" />
                <label className="btn-secondary cursor-pointer px-6 py-3">Changer la couverture<input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" /></label>
              </div>
              {bannerStatus === 'pending' && <p className="mt-3 text-amber-400">⏳ En attente de validation</p>}
            </div>

            {/* Avatar */}
            <div>
              <h2 className="text-xl mb-2">Photo de profil</h2>
              <p className="text-zinc-400 text-sm mb-4">512 × 512 px • Max 5 Mo</p>
              <div className="flex items-center gap-6">
                <img src={pendingAvatar || avatar} alt="avatar" className="w
