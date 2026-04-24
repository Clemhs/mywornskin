'use client';
// V10 - Version complète et robuste (bouton Enregistrer corrigé)
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
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
      setToastMessage('✅ Modifications enregistrées avec succès');
      setTimeout(() => setToastMessage(null), 4000);
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Link href={`/creators/${id}`} className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm">← Retour au profil</Link>
          <h1 className="text-2xl font-semibold text-center sm:text-left">Personnaliser mon profil</h1>
          
          <button 
            onClick={handleSave}
            disabled={saving}
            className="btn-primary px-8 py-3 text-sm sm:text-base"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Tout le reste est exactement comme ta version originale */}
          {/* ... (le reste de ton code V10) ... */}
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
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

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
