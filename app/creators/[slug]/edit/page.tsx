'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Save, Camera, Clock, X, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CreatorEditPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [salesBadge, setSalesBadge] = useState<number | null>(null);
  const [frame, setFrame] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; link?: string } | null>(null);

  const availableSalesBadges = [10, 50, 100, 500];
  const availableFrames = [
    { id: "rose", name: "1 an" },
    { id: "silver", name: "2 ans" },
    { id: "gold", name: "5 ans" },
  ];

  // Chargement complet des données AVANT d'afficher quoi que ce soit
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

  // Toast rouge UNIQUE quand une photo est refusée
  useEffect(() => {
    if (profile?.avatar_status === 'rejected' || profile?.banner_status === 'rejected') {
      setToast({
        message: "Une de vos photos a été refusée",
        type: 'error',
        link: "/guidelines"
      });
    }
  }, [profile]);

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
    loadData(); // Mise à jour immédiate
  };

  const handleSave = async () => {
    if (!user || !profile) return;
    setSaving(true);

    await supabase
      .from('profiles')
      .update({ sales_badge: salesBadge, frame })
      .eq('id', user.id);

    setSaving(false);
    setToast({ message: "✅ Enregistré avec succès", type: 'success' });
    loadData();
    setTimeout(() => setToast(null), 2500);
  };

  const toggleSalesBadge = (level: number) => setSalesBadge(prev => prev === level ? null : level);
  const selectFrame = (id: string) => setFrame(prev => prev === id ? null : id);
  const closeToast = () => setToast(null);

  // On attend que le profil soit chargé → plus de flash
  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center pt-20">
        Chargement du profil...
      </div>
    );
  }

  const isAvatarPending = profile.avatar_status === 'pending';
  const isBannerPending = profile.banner_status === 'pending';

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER - Titre parfaitement centré */}
        <div className="flex items-center justify-between mb-12 relative">
          <Link href="/creators/me" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft size={20} />
            Retour au profil
          </Link>

          <h1 className="text-4xl font-bold absolute left-1/2 -translate-x-1/2">Édition de profil</h1>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-pink-600 hover:bg-pink-500 px-10 py-4 rounded-3xl font-semibold flex items-center gap-3 disabled:opacity-70"
          >
            <Save className="w-5 h-5" />
            {saving ? "Enregistrement..." : "Enregistrer tout"}
          </button>
        </div>

        {/* TOAST UNIQUE - Une seule croix à droite */}
        {toast && (
          <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl text-base shadow-2xl flex items-center gap-3 min-w-[460px]
            ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>
            <span>{toast.message}</span>
            
            {toast.link && (
              <Link href={toast.link} className="underline hover:text-white text-sm whitespace-nowrap ml-2">
                Voir les guidelines →
              </Link>
            )}

            <button 
              onClick={closeToast}
              className="ml-auto p-1 hover:bg-white/20 rounded-full transition"
            >
              <X size={18} />
            </button>
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

                {isBannerPending && (
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

                    {isAvatarPending && (
                      <div className="absolute -top-3 -right-3 bg-amber-500 text-black text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                        <Clock size={14} /> En attente
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Commentaires à valider */}
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
                        <button onClick={() => {}} className="flex-1 bg-emerald-600 py-3 rounded-2xl">✅ Valider</button>
                        <button onClick={() => {}} className="flex-1 bg-red-600 py-3 rounded-2xl">❌ Rejeter</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* COLONNE DROITE - TOUT LE RESTE */}
          <div className="lg:col-span-7 space-y-12">
            {/* Changer les images */}
            <div>
              <h2 className="text-xl mb-4">Changer les images</h2>
              <div className="grid grid-cols-2 gap-6">
                <label className="cursor-pointer border border-dashed border-zinc-700 hover:border-pink-500 rounded-3xl p-8 text-center relative">
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], 'banner')} className="hidden" />
                  <Camera className="mx-auto mb-3 text-pink-400" size={36} />
                  <p className="text-pink-400 font-medium">Changer la couverture</p>
                </label>

                <label className="cursor-pointer border border-dashed border-zinc-700 hover:border-pink-500 rounded-3xl p-8 text-center relative">
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], 'avatar')} className="hidden" />
                  <Camera className="mx-auto mb-3 text-pink-400" size={36} />
                  <p className="text-pink-400 font-medium">Changer la photo de profil</p>
                </label>
              </div>
            </div>

            {/* Badges de ventes */}
            <div>
              <h2 className="text-xl mb-4">Badges de ventes</h2>
              <div className="flex gap-6 overflow-x-auto pb-6">
                {availableSalesBadges.map(level => (
                  <button 
                    key={level} 
                    onClick={() => toggleSalesBadge(level)} 
                    className={`flex-shrink-0 w-28 h-28 rounded-3xl flex flex-col items-center justify-center border-2 transition-all ${salesBadge === level ? 'border-pink-400 bg-pink-900/30' : 'border-zinc-700 hover:border-pink-400'}`}
                  >
                    <img src={`/badges/${level}.png`} className="w-16 h-16" alt={`${level}`} />
                    <span className="text-sm mt-1">{level} ventes</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cadres d'ancienneté */}
            <div>
              <h2 className="text-xl mb-4">Cadres de profil</h2>
              <div className="flex gap-6 overflow-x-auto pb-6">
                {availableFrames.map(f => (
                  <button 
                    key={f.id} 
                    onClick={() => selectFrame(f.id)} 
                    className={`flex-shrink-0 w-28 h-28 rounded-3xl border-2 overflow-hidden transition-all relative ${frame === f.id ? 'border-pink-400' : 'border-zinc-700 hover:border-pink-400'}`}
                  >
                    <div className={`shimmer-frame w-full h-full ${f.id}`} />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs bg-black/70 px-3 py-0.5 rounded-full">{f.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Boutique cosmétiques */}
            <div>
              <h2 className="text-xl mb-4 flex items-center gap-2">
                <span>🛍️</span> Boutique cosmétiques
              </h2>
              <div className="bg-zinc-900 rounded-3xl p-8 text-center text-zinc-400">
                Prochainement disponible...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles shimmer (inchangés) */}
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
