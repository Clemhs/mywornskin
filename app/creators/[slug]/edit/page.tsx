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

  const availableSalesBadges = [10, 50, 100, 500];
  const availableFrames = [
    { id: "rose", name: "1 an" },
    { id: "silver", name: "2 ans" },
    { id: "gold", name: "5 ans" },
  ];

  const loadData = useCallback(async () => {
    if (!user) return;

    const { data: prof, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) console.error("Erreur load profile:", error);
    if (prof) {
      setProfile(prof);
      setSalesBadge(prof.sales_badge);
      setFrame(prof.frame);
      setBio(prof.bio || '');
      setCountry(prof.country || '');
      setCity(prof.city || '');
      setSize(prof.size || '');
      setShoeSize(prof.shoe_size || '');
    }

    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('creator_id', user.id)
      .eq('status', 'pending')
      .limit(3);
    setPendingReviews(reviews || []);
  }, [user, supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ==================== TOAST PHOTO REFUSÉE - VERSION ROBUSTE ====================
  useEffect(() => {
    if (!profile || !user) return;

    const dismissedKey = `dismissed_rejected_toast_${user.id}`;
    const hasRejected = profile.avatar_status === 'rejected' || profile.banner_status === 'rejected';

    if (hasRejected && !localStorage.getItem(dismissedKey)) {
      setToast({
        message: "Une de vos photos a été refusée par l'équipe.",
        type: 'error',
        link: "/guidelines"
      });
    }
  }, [profile?.avatar_status, profile?.banner_status, user]); // Dépendances plus précises

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

  // ... (le reste de tes fonctions : validateComment, saveProfile, toggleSalesBadge, selectFrame, handleBioChange, uploadImage, etc. reste IDENTIQUE à ton ancien code)

  if (!user || !profile) {
    return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center pt-20">Chargement du profil...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex items-center mb-12">
          <Link href="/creators/me" className="flex items-center gap-2 text-zinc-400 hover:text-white flex-shrink-0">
            <ArrowLeft size={20} /> Retour au profil
          </Link>
          <h1 className="text-4xl font-bold flex-1 text-center">Édition de profil</h1>
          <div className="w-[140px] flex-shrink-0" />
        </div>

        {/* TOAST */}
        {toast && (
          <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-2xl text-base shadow-2xl flex items-center gap-3 min-w-[460px]
            ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>
            <span>{toast.message}</span>
            {toast.link && (
              <Link href={toast.link} className="underline text-sm ml-2 hover:no-underline">
                Guidelines →
              </Link>
            )}
            <button onClick={closeToast} className="ml-auto p-1 hover:bg-white/20 rounded-full transition">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Le reste de ton JSX (aperçu, changer images, infos personnelles, badges, cadres, etc.) reste EXACTEMENT comme dans ton dernier code */}

        {/* ... (je ne recopie pas tout ici pour ne pas allonger, mais tu gardes tout le JSX de ton ancien code) ... */}

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
