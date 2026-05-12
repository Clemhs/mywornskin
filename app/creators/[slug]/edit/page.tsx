'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Camera, Clock, X, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
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
  const [toast, setToast] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  // ... (availableSalesBadges et availableFrames restent les mêmes)

  const loadData = useCallback(async () => {
    if (!user) return;

    console.log("🔄 loadData appelé");

    const { data: prof, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) console.error("Erreur Supabase:", error);
    if (prof) {
      console.log("📊 Profil chargé → avatar_status:", prof.avatar_status, " | banner_status:", prof.banner_status);
      setProfile(prof);
      setSalesBadge(prof.sales_badge);
      setFrame(prof.frame);
      setBio(prof.bio || '');
      setCountry(prof.country || '');
      setCity(prof.city || '');
      setSize(prof.size || '');
      setShoeSize(prof.shoe_size || '');
    }
  }, [user, supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const hasRejectedPhoto = profile?.avatar_status === 'rejected' || profile?.banner_status === 'rejected';
  console.log("🎯 hasRejectedPhoto =", hasRejectedPhoto);

  const dismissRejectedBanner = () => {
    setDismissed(true);
    if (user) localStorage.setItem(`dismissed_rejected_${user.id}`, 'true');
  };

  const uploadImage = async (file: File, type: 'avatar' | 'banner') => {
    // ... ton upload habituel ...
    // Après succès :
    setDismissed(false);
    if (user) localStorage.removeItem(`dismissed_rejected_${user.id}`);
    loadData();
  };

  // Le reste de la page (formulaires, badges, cadres, etc.)

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20 pb-12">
      {/* ... header ... */}

      {/* BANDEAU */}
      {hasRejectedPhoto && !dismissed && (
        <div className="mb-8 bg-red-900/30 border border-red-600 rounded-3xl p-5 flex items-start gap-4">
          <AlertTriangle className="text-red-500 mt-0.5" size={24} />
          <div className="flex-1">
            <p className="font-medium text-red-400">Une ou plusieurs de vos photos ont été refusées par l'équipe.</p>
            <p className="text-sm text-zinc-400 mt-1">Veuillez les remplacer en respectant les guidelines.</p>
          </div>
          <Link href="/guidelines" className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition mt-0.5" target="_blank">
            Voir les Guidelines →
          </Link>
          <button onClick={dismissRejectedBanner} className="text-zinc-400 hover:text-white p-1 -mt-1 -mr-1">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Le reste de ta page */}
    </div>
  );
}
