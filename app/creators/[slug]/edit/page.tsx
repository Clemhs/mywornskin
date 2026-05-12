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

    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

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

  // ==================== TOAST PHOTO REFUSÉE - VERSION ULTRA ROBUSTE ====================
  const checkRejectedToast = useCallback(() => {
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
  }, [profile, user]);

  useEffect(() => {
    checkRejectedToast();
  }, [checkRejectedToast]);

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

  // ... (toutes tes autres fonctions restent identiques : validateComment, saveProfile, toggleSalesBadge, selectFrame, handle*Change, uploadImage)

  const validateComment = async (reviewId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', reviewId);

    if (error) {
      setToast({ message: "Erreur lors de la validation", type: 'error' });
    } else {
      setToast({ 
        message: status === 'approved' ? "✅ Commentaire validé" : "❌ Commentaire rejeté", 
        type: 'success' 
      });
      loadData();
    }
  };

  const saveProfile = async (updates: any) => {
    if (!user) return;
    await supabase.from('profiles').update(updates).eq('id', user.id);
  };

  const toggleSalesBadge = async (level: number) => {
    const newBadge = salesBadge === level ? null : level;
    setSalesBadge(newBadge);
    await saveProfile({ sales_badge: newBadge });
    setToast({ message: "✅ Badge mis à jour", type: 'success' });
  };

  const selectFrame = async (id: string) => {
    const newFrame = frame === id ? null : id;
    setFrame(newFrame);
    await saveProfile({ frame: newFrame });
    setToast({ message: "✅ Cadre mis à jour", type: 'success' });
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
    saveProfile({ bio: e.target.value });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountry(e.target.value);
    saveProfile({ country: e.target.value });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    saveProfile({ city: e.target.value });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSize(e.target.value);
    saveProfile({ size: e.target.value });
  };

  const handleShoeSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShoeSize(e.target.value);
    saveProfile({ shoe_size: e.target.value });
  };

  const uploadImage = async (file: File, type: 'avatar' | 'banner') => {
    if (!user) return;
    const fileName = `${user.id}-${type}-${Date.now()}.${file.name.split('.').pop()}`;

    const { error } = await supabase.storage.from('profiles').upload(fileName, file, { upsert: true });
    if (error) return setToast({ message: "Erreur d'upload", type: 'error' });

    const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);

    const updateData = type === 'avatar'
      ? { avatar_pending_url: publicUrl, avatar_status: 'pending' as const }
      : { banner_pending_url: publicUrl, banner_status: 'pending' as const };

    await supabase.from('profiles').update(updateData).eq('id', user.id);

    setToast({ message: `📸 Photo de ${type} envoyée en attente`, type: 'success' });
    loadData();
  };

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

        {/* Le reste de la page (aperçu, infos, badges, cadres...) est identique à ton code précédent */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* APERÇU EN DIRECT + COMMENTAIRES (copie-colle du tien) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-xl mb-4">Aperçu en direct</h2>
              <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-video">
                <img 
                  src={profile.banner_pending_url || profile.banner_url || "https://picsum.photos/id/1015/1200/400"} 
                  alt="Bannière" 
                  className="w-full h-full object-cover" 
                />
                {(profile.banner_status === 'pending' || profile.avatar_status === 'pending') && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-black text-sm px-4 py-1 rounded-full flex items-center gap-2 font-medium">
                    <Clock size={16} /> En attente de validation
                  </div>
                )}
                <div className="absolute bottom-8 left-8">
                  <div className="relative">
                    <img 
                      src={profile.avatar_pending_url || profile.avatar_url || "https://picsum.photos/id/64/300/300"} 
                      alt="Avatar" 
                      className="w-32 h-32 rounded-2xl border-4 border-zinc-950 object-cover" 
                    />
                    {frame && <div className={`absolute inset-0 rounded-2xl border-4 shimmer-frame ${frame}`} />}
                    {salesBadge && <img src={`/badges/${salesBadge}.png`} className="absolute -top-3 -right-3 w-14 h-14" alt="Badge" />}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl mb-4">Commentaires à valider ({pendingReviews.length})</h2>
              <div className="space-y-4">
                {pendingReviews.length === 0 ? (
                  <p className="text-zinc-500 italic bg-zinc-900 p-6 rounded-3xl">Aucun commentaire en attente pour le moment.</p>
                ) : (
                  pendingReviews.map(r => (
                    <div key={r.id} className="bg-zinc-900 rounded-3xl p-6">
                      <p className="italic">"{r.comment}"</p>
                      <div className="flex gap-3 mt-4">
                        <button onClick={() => validateComment(r.id, 'approved')} className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-2xl">✅ Valider</button>
                        <button onClick={() => validateComment(r.id, 'rejected')} className="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-2xl">❌ Rejeter</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* COLONNE DROITE - tout le reste identique */}
          <div className="lg:col-span-7 space-y-10">
            {/* Changer les images, Informations personnelles, Badges, Cadres, Boutique... */}
            {/* (copie-colle tout ce que tu avais avant) */}
            {/* ... */}
          </div>
        </div>
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
