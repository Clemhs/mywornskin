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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; link?: string } | null>(null);

  const [dismissed, setDismissed] = useState(false);

  const availableSalesBadges = [10, 50, 100, 500];
  const availableFrames = [
    { id: "rose", name: "1 an" },
    { id: "silver", name: "2 ans" },
    { id: "gold", name: "5 ans" },
  ];

  const loadData = useCallback(async () => {
    if (!user) return;

    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();

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

  // Chargement initial + lecture du localStorage
  useEffect(() => {
    loadData();

    if (user) {
      const savedDismissed = localStorage.getItem(`dismissed_rejected_${user.id}`);
      setDismissed(savedDismissed === 'true');
    }
  }, [loadData, user]);

  const hasRejectedPhoto = profile?.avatar_status === 'rejected' || profile?.banner_status === 'rejected';

  const dismissRejectedBanner = () => {
    setDismissed(true);
    if (user) localStorage.setItem(`dismissed_rejected_${user.id}`, 'true');
  };

  const uploadImage = async (file: File, type: 'avatar' | 'banner') => {
    if (!user) return;
    const fileName = `${user.id}-${type}-${Date.now()}.${file.name.split('.').pop()}`;

    const { error } = await supabase.storage.from('profiles').upload(fileName, file, { upsert: true });
    if (error) return setToast({ message: "Erreur d'upload", type: 'error' });

    const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);

    const updateData = type === 'avatar'
      ? { avatar_pending_url: publicUrl, avatar_status: 'pending' }
      : { banner_pending_url: publicUrl, banner_status: 'pending' };

    await supabase.from('profiles').update(updateData).eq('id', user.id);

    setToast({ message: `📸 Photo de ${type} envoyée en attente`, type: 'success' });
    setDismissed(false);
    if (user) localStorage.removeItem(`dismissed_rejected_${user.id}`);
    loadData();
  };

  // ... (ajoute ici toutes tes autres fonctions : validateComment, saveProfile, toggleSalesBadge, selectFrame, handleBioChange, etc.)

  if (!user || !profile) {
    return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center pt-20">Chargement...</div>;
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

        {/* BANDEAU ROUGE */}
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

        {/* Toast */}
        {toast && toast.type === 'success' && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-2xl bg-emerald-600 text-white flex items-center gap-3 shadow-2xl">
            {toast.message}
            <button onClick={() => setToast(null)}><X size={18} /></button>
          </div>
        )}

        {/* Le reste de la page (aperçu, formulaires, badges, cadres...) est identique à avant */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ... ton contenu complet ... */}
        </div>
      </div>
    </div>
  );
}
