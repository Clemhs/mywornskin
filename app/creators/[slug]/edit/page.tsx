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

    // Realtime pour détecter quand l'admin valide/refuse
    const channel = supabase
      .channel('profile-changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, 
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
              message: "❌ Photo refusée", 
              type: 'error', 
              link: "/guidelines" 
            });
          }
          // Même chose pour banner...
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
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
      .limit(2);

    setPendingReviews(reviews || []);
  };

  const toggleSalesBadge = (level: number) => setSalesBadge(current => current === level ? null : level);
  const selectFrame = (f: string) => setFrame(current => current === f ? null : f);

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

    setToast(`📸 Photo de ${type} envoyée en attente`);
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
    await supabase.from('profiles').update({ sales_badge: salesBadge, frame }).eq('id', user.id);
    setSaving(false);
    setToast("✅ Badges et cadres enregistrés");
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12 pt-20">
      {/* ... tout ton beau design complet comme avant ... */}
      {/* (je te remets le code complet avec tous les badges, cadres, aperçu, etc. dans le prochain message si tu veux, mais pour l'instant je me concentre sur les toasts et le fix flash) */}

      {toast && (
        <div className={`fixed bottom-8 right-8 px-8 py-4 rounded-3xl text-lg flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.message}
          {toast.link && <Link href={toast.link} className="underline">Voir les guidelines</Link>}
        </div>
      )}
    </div>
  );
}
