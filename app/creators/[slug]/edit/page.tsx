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
  const [dismissRejected, setDismissRejected] = useState(false); // Fermeture temporaire

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

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Toast success auto-dismiss
  useEffect(() => {
    if (toast?.type === 'success') {
      const timer = setTimeout(() => setToast(null), 2200);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const closeToast = () => setToast(null);

  const hasRejectedPhoto = profile?.avatar_status === 'rejected' || profile?.banner_status === 'rejected';

  const validateComment = async (reviewId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.from('reviews').update({ status }).eq('id', reviewId);
    if (error) {
      setToast({ message: "Erreur lors de la validation", type: 'error' });
    } else {
      setToast({ message: status === 'approved' ? "✅ Commentaire validé" : "❌ Commentaire rejeté", type: 'success' });
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

        {/* BANDEAU ROUGE PHOTO REFUSÉE */}
        {hasRejectedPhoto && !dismissRejected && (
          <div className="mb-8 bg-red-900/30 border border-red-600 rounded-3xl p-5 flex items-start gap-4 relative">
            <AlertTriangle className="text-red-500 mt-0.5" size={24} />
            <div className="flex-1 pr-8">
              <p className="font-medium text-red-400">Une ou plusieurs de vos photos ont été refusées par l'équipe.</p>
              <p className="text-sm text-zinc-400 mt-1">Veuillez les remplacer en respectant les guidelines.</p>
            </div>
            <Link 
              href="/guidelines" 
              className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition mt-0.5"
              target="_blank"
            >
              Voir les Guidelines →
            </Link>
            <button 
              onClick={() => setDismissRejected(true)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Toast success */}
        {toast && toast.type === 'success' && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-2xl bg-emerald-600 text-white flex items-center gap-3 shadow-2xl">
            {toast.message}
            <button onClick={closeToast}><X size={18} /></button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* APERÇU EN DIRECT */}
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

          {/* COLONNE DROITE - TOUT LE RESTE */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h2 className="text-xl mb-4">Changer les images</h2>
              <div className="grid grid-cols-2 gap-6">
                <label className="cursor-pointer border border-dashed border-zinc-700 hover:border-pink-500 rounded-3xl p-8 text-center">
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], 'banner')} className="hidden" />
                  <Camera className="mx-auto mb-3 text-pink-400" size={36} />
                  <p className="text-pink-400 font-medium">Changer la couverture</p>
                </label>

                <label className="cursor-pointer border border-dashed border-zinc-700 hover:border-pink-500 rounded-3xl p-8 text-center">
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], 'avatar')} className="hidden" />
                  <Camera className="mx-auto mb-3 text-pink-400" size={36} />
                  <p className="text-pink-400 font-medium">Changer la photo de profil</p>
                </label>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl">Informations personnelles</h2>
                <p className="text-emerald-500 text-sm flex items-center gap-1.5">
                  <CheckCircle size={16} /> Enregistrement automatique
                </p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-5">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Bio</label>
                  <textarea value={bio} onChange={handleBioChange} rows={3} className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500" placeholder="Présente-toi en quelques lignes..." />
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

            <div>
              <h2 className="text-xl mb-4">Badges de ventes</h2>
              <div className="flex gap-6 overflow-x-auto pb-6">
                {availableSalesBadges.map(level => (
                  <button key={level} onClick={() => toggleSalesBadge(level)} 
                    className={`flex-shrink-0 w-28 h-28 rounded-3xl flex flex-col items-center justify-center border-2 transition-all ${salesBadge === level ? 'border-pink-400 bg-pink-900/30' : 'border-zinc-700 hover:border-pink-400'}`}>
                    <img src={`/badges/${level}.png`} className="w-16 h-16" alt={`${level}`} />
                    <span className="text-sm mt-1">{level} ventes</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl mb-4">Cadres de profil</h2>
              <div className="flex gap-6 overflow-x-auto pb-6">
                {availableFrames.map(f => (
                  <button key={f.id} onClick={() => selectFrame(f.id)}
                    className={`flex-shrink-0 w-28 h-28 rounded-3xl border-2 overflow-hidden transition-all relative ${frame === f.id ? 'border-pink-400' : 'border-zinc-700 hover:border-pink-400'}`}>
                    <div className={`shimmer-frame w-full h-full ${f.id}`} />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs bg-black/70 px-3 py-0.5 rounded-full">{f.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl mb-4 flex items-center gap-2">🛍️ Boutique cosmétiques</h2>
              <div className="bg-zinc-900 rounded-3xl p-8 text-center text-zinc-400">
                Prochainement disponible...
              </div>
            </div>
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
