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
  const [toast, setToast] = useState<any>(null);

  // ... tous tes autres states (salesBadge, frame, bio, etc.)

  const loadData = useCallback(async () => {
    if (!user) return;

    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (prof) setProfile(prof);

    // Chargement des reviews en attente...
  }, [user, supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  // BANDEAU ROUGE - Version plus sûre
  const hasRejectedPhoto = profile?.avatar_status === 'rejected' || profile?.banner_status === 'rejected';

  const dismissRejectedBanner = () => {
    if (user && profile) {
      supabase.from('profiles').update({ 
        avatar_status: profile.avatar_status === 'rejected' ? 'approved' : profile.avatar_status,
        banner_status: profile.banner_status === 'rejected' ? 'approved' : profile.banner_status 
      }).eq('id', user.id);
    }
  };

  const uploadImage = async (file: File, type: 'avatar' | 'banner') => {
    // ... ton code d'upload ...

    // Après upload, on force le statut en pending et on nettoie les anciens refus
    await supabase.from('profiles').update({
      [`${type}_status`]: 'pending',
      [`${type}_pending_url`]: publicUrl
    }).eq('id', user.id);

    setToast({ message: `Photo envoyée en attente`, type: 'success' });
    loadData();
  };

  // Le reste de ton code (formulaires, badges, cadres...) reste identique.

  return (
    // ... ton JSX ...

    {/* BANDEAU ROUGE */}
    {hasRejectedPhoto && (
      <div className="mb-8 bg-red-900/30 border border-red-600 rounded-3xl p-5 flex items-start gap-4">
        <AlertTriangle className="text-red-500 mt-0.5" size={24} />
        <div className="flex-1">
          <p className="font-medium text-red-400">Une ou plusieurs de vos photos ont été refusées par l'équipe.</p>
          <p className="text-sm text-zinc-400 mt-1">Veuillez les remplacer en respectant les guidelines.</p>
        </div>
        <Link href="/guidelines" className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-2xl text-sm font-medium whitespace-nowrap" target="_blank">
          Voir les Guidelines →
        </Link>
        <button onClick={dismissRejectedBanner} className="text-zinc-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
    )}

    {/* Le reste de la page */}
  );
}
