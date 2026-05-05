'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Save, Camera, ShoppingBag, Check, X, Clock } from 'lucide-react';
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

  // Realtime pour détecter validation/refus par l'admin
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
          const p = payload.new;
          setAvatarUrl(p.avatar_url || "");
          setBannerUrl(p.banner_url || "");
          setAvatarPendingUrl(p.avatar_pending_url || "");
          setBannerPendingUrl(p.banner_pending_url || "");
          setAvatarStatus(p.avatar_status || 'approved');
          setBannerStatus(p.banner_status || 'approved');

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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, avatarStatus]);

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
      .order('created_at', { ascending: false })
      .limit(2);

    setPendingReviews(reviews || []);
  };

  const toggleSalesBadge = (level: number) => {
    setSalesBadge(current => current === level ? null : level);
  };

  const selectFrame = (f: string) => {
    setFrame(current => current === f ? null : f);
  };

  const uploadImage = async (file: File, type: 'avatar' | 'banner') => {
    if (!user) return null;
    const fileName = `${user.id}-${type}-${Date.now()}.${file.name.split('.').pop()}`;

    const { error } = await supabase.storage.from('profiles').upload(fileName, file, { upsert: true });
    if (error) return null;

    const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);

    const updateData = type === 'avatar' 
      ? { avatar_pending_url: publicUrl, avatar_status: 'pending' }
      : { banner_pending_url: publicUrl, banner_status: 'pending' };

    await supabase.from('profiles').update(updateData).eq('id', user.id);

    if (type === 'avatar') setAvatarPendingUrl(publicUrl);
    else setBannerPendingUrl(publicUrl);

    setToast(`📸 Photo de ${type} envoyée en attente de validation`);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file, 'avatar');
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file, 'banner');
  };

  const handleModerateReview = async (reviewId: string, status: 'approved' | 'rejected') => {
    await supabase.from('reviews').update({ status }).eq('id', reviewId);
    setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    await supabase.from('profiles').update({
      sales_badge: salesBadge,
      frame: frame,
    }).eq('id', user.id);

    setSaving(false);
    setToast("✅ Badges et cadres enregistrés");
    setTimeout(() => setToast(null), 2000);
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
          <div className={`fixed bottom-8 right-8 px-8 py-4 rounded-3xl text-lg flex items-center gap-3 z-50 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
            {toast.message}
            {toast.link && <Link href={toast.link} className="underline ml-2">Voir les guidelines →</Link>}
          </div>
        )}

        {/* Le reste de ton beau design (aperçu, badges, cadres, etc.) est conservé */}
        {/* ... (je te mets le code complet si tu veux, mais pour l'instant on se concentre sur le fix) */}

      </div>
    </div>
  );
}
