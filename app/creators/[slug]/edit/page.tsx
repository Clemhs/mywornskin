'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Camera, Clock, X, ArrowLeft, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CreatorEditPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [salesBadge, setSalesBadge] = useState<number | null>(null);
  const [frame, setFrame] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [size, setSize] = useState('');
  const [shoeSize, setShoeSize] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; link?: string } | null>(null);

  // ... availableSalesBadges et availableFrames inchangés ...

  const loadData = useCallback(async () => {
    if (!user) return;
    console.log("🔄 loadData appelé");

    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    if (prof) {
      console.log("📊 Profil chargé :", { 
        avatar_status: prof.avatar_status, 
        banner_status: prof.banner_status 
      });
      setProfile(prof);
      // ... set des autres états ...
    }
  }, [user, supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ==================== TOAST PHOTO REFUSÉE - DEBUG ====================
  useEffect(() => {
    if (!profile || !user) {
      console.log("⏳ Toast skipped - pas de profile/user");
      return;
    }

    const dismissedKey = `dismissed_rejected_toast_${user.id}`;
    const hasRejected = profile.avatar_status === 'rejected' || profile.banner_status === 'rejected';

    console.log("🔍 Check rejected :", { hasRejected, dismissed: !!localStorage.getItem(dismissedKey) });

    if (hasRejected && !localStorage.getItem(dismissedKey)) {
      console.log("🚨 Affichage du toast rouge !");
      setToast({
        message: "Une de vos photos a été refusée par l'équipe.",
        type: 'error',
        link: "/guidelines"
      });
    }
  }, [profile, user]);

  const closeToast = () => {
    if (toast?.type === 'error' && user) {
      localStorage.setItem(`dismissed_rejected_toast_${user.id}`, 'true');
    }
    setToast(null);
  };

  // Toast success auto-dismiss
  useEffect(() => {
    if (toast?.type === 'success') {
      const timer = setTimeout(() => setToast(null), 2200);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ... Toutes tes autres fonctions (validateComment, saveProfile, toggleSalesBadge, selectFrame, handle*Change, uploadImage) restent IDENTIQUES ...

  if (!user || !profile) {
    return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center pt-20">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20 pb-12">
      {/* ... Header avec titre ... */}

      {/* TOAST */}
      {toast && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-2xl text-base shadow-2xl flex items-center gap-3 min-w-[460px]
          ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>
          <span>{toast.message}</span>
          {toast.link && <Link href={toast.link} className="underline text-sm ml-2">Guidelines →</Link>}
          <button onClick={closeToast} className="ml-auto p-1 hover:bg-white/20 rounded-full">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Le reste de ta page (aperçu, infos, badges, cadres...) est exactement comme avant */}
      {/* ... (copie-colle tout le JSX de ton code précédent) ... */}

    </div>
  );
}
