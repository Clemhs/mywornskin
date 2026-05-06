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

  useEffect(() => { loadData(); }, [loadData]);

  // Toast (inchangé)
  useEffect(() => {
    if (!profile) return;
    if (profile.avatar_status === 'rejected' || profile.banner_status === 'rejected') {
      setToast({ message: "Une de vos photos a été refusée", type: 'error', link: "/guidelines" });
      return;
    }
    if ((profile.avatar_status === 'approved' || profile.banner_status === 'approved') && 
        !sessionStorage.getItem('validatedToastShown')) {
      setToast({ message: "✅ Une de vos photos a été validée par l'équipe", type: 'success' });
      sessionStorage.setItem('validatedToastShown', 'true');
    }
  }, [profile]);

  const saveProfile = async (updates: any) => {
    if (!user) return;
    await supabase.from('profiles').update(updates).eq('id', user.id);
  };

  const toggleSalesBadge = async (level: number) => { /* inchangé */ };
  const selectFrame = async (id: string) => { /* inchangé */ };

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

  const closeToast = () => setToast(null);

  if (!user || !profile) {
    return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center pt-20">Chargement...</div>;
  }

  const isAvatarPending = profile.avatar_status === 'pending';
  const isBannerPending = profile.banner_status === 'pending';

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

        {toast && (
          <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl text-base shadow-2xl flex items-center gap-3 min-w-[460px]
            ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>
            <span>{toast.message}</span>
            {toast.link && <Link href={toast.link} className="underline text-sm ml-2">Guidelines →</Link>}
            <button onClick={closeToast} className="ml-auto p-1 hover:bg-white/20 rounded-full">
              <X size={18} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* APERÇU EN DIRECT - inchangé */}
          <div className="lg:col-span-5 space-y-8">
            {/* Ton code d'aperçu actuel reste identique */}
            {/* ... */}
          </div>

          {/* COLONNE DROITE - COMPACTE */}
          <div className="lg:col-span-7 space-y-10">
            {/* Changer les images - inchangé */}
            <div>
              <h2 className="text-xl mb-4">Changer les images</h2>
              <div className="grid grid-cols-2 gap-6">
                {/* ... tes deux labels ... */}
              </div>
            </div>

            {/* Informations personnelles */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl">Informations personnelles</h2>
                <p className="text-xs text-emerald-500 flex items-center gap-1">
                  <CheckCircle size={14} /> Enregistrement automatique
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-5">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Bio</label>
                  <textarea 
                    value={bio} 
                    onChange={handleBioChange} 
                    rows={3} 
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500" 
                    placeholder="Présente-toi en quelques lignes..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Pays</label>
                    <input type="text" value={country} onChange={handleCountryChange} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500" placeholder="France" />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Ville</label>
                    <input type="text" value={city} onChange={handleCityChange} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500" placeholder="Paris" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Taille vêtements</label>
                    <input type="text" value={size} onChange={handleSizeChange} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500" placeholder="S, M, 38..." />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Pointure</label>
                    <input type="text" value={shoeSize} onChange={handleShoeSizeChange} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500" placeholder="38, 39..." />
                  </div>
                </div>
              </div>
            </div>

            {/* Badges, Cadres, Boutique (inchangés) */}
            {/* ... reste de ton code ... */}

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
