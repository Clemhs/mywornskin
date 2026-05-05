'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Save, Camera, ShoppingBag, Check, X, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CreatorEditPage() {
  const { user } = useAuth();
  const supabase = createClient();

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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; link?: string } | null>(null);

  const availableSalesBadges = [10, 50, 100, 500];
  const availableFrames = [
    { id: "rose", name: "1 an" },
    { id: "silver", name: "2 ans" },
    { id: "gold", name: "5 ans" },
  ];

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
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
      .eq('creator_id', user!.id)
      .eq('status', 'pending')
      .limit(3);

    setPendingReviews(reviews || []);
  };

  // Realtime (version simplifiée et typée correctement)
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`profile-${user.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'profiles', 
          filter: `id=eq.${user.id}` 
        },
        (payload) => {
          const p = payload.new as any;

          setAvatarStatus(p.avatar_status || 'approved');
          setBannerStatus(p.banner_status || 'approved');
          setAvatarUrl(p.avatar_url || avatarUrl);
          setBannerUrl(p.banner_url || bannerUrl);

          // Toasts pour validation / refus
          if (p.avatar_status === 'approved' && avatarStatus === 'pending') {
            setToast({ message: "✅ Photo de profil validée par l'équipe !", type: 'success' });
          }
          if (p.avatar_status === 'rejected') {
            setToast({ 
              message: "❌ Photo refusée par l'administrateur", 
              type: 'error', 
              link: "/guidelines" 
            });
          }
          if (p.banner_status === 'approved' && bannerStatus === 'pending') {
            setToast({ message: "✅ Photo de couverture validée par l'équipe !", type: 'success' });
          }

          setTimeout(() => setToast(null), 4000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const uploadImage = async (file: File, type: 'avatar' | 'banner') => {
    if (!user) return;

    const fileName = `${user.id}-${type}-${Date.now()}`;
    const { error } = await supabase.storage.from('profiles').upload(fileName, file, { upsert: true });

    if (error) {
      setToast({ message: "Erreur d'upload", type: 'error' });
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);

    const updateData = type === 'avatar' 
      ? { avatar_pending_url: publicUrl, avatar_status: 'pending' as const }
      : { banner_pending_url: publicUrl, banner_status: 'pending' as const };

    await supabase.from('profiles').update(updateData).eq('id', user.id);

    setToast({ message: `📸 Photo de ${type} envoyée en attente`, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file, 'avatar');
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file, 'banner');
  };

  const toggleSalesBadge = (level: number) => setSalesBadge(prev => prev === level ? null : level);
  const selectFrame = (id: string) => setFrame(prev => prev === id ? null : id);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').update({ sales_badge: salesBadge, frame }).eq('id', user.id);
    setSaving(false);
    setToast({ message: "✅ Tout a été enregistré", type: 'success' });
    setTimeout(() => setToast(null), 2500);
  };

  const handleModerateReview = async (id: string, status: 'approved' | 'rejected') => {
    await supabase.from('reviews').update({ status }).eq('id', id);
    setPendingReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header de la page */}
        <div className="flex justify-between items-center mb-10">
          <Link href="/creators/me" className="text-zinc-400 hover:text-white flex items-center gap-2">
            ← Retour au profil
          </Link>
          <h1 className="text-4xl font-bold">Édition de profil</h1>
          <button onClick={handleSave} disabled={saving} className="bg-pink-600 hover:bg-pink-500 px-8 py-3.5 rounded-3xl font-medium flex items-center gap-2">
            <Save size={20} />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>

        {/* Toast centré et gros */}
        {toast && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            <div className={`px-12 py-6 rounded-3xl text-2xl font-medium shadow-2xl flex items-center gap-4
              ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
              {toast.message}
              {toast.link && (
                <Link href={toast.link} className="underline text-lg hover:no-underline ml-2">
                  Voir les guidelines →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Le reste de ton UI (badges, cadres, aperçus, etc.) reste identique à ta version précédente */}
        {/* ... Colle ici le reste de ton code si tu veux que je te le redonne complet ... */}

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
