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
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; link?: string } | null>(null);

  const [salesBadge, setSalesBadge] = useState<number | null>(null);
  const [frame, setFrame] = useState<string | null>(null);

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

  // Upload image
  const uploadImage = async (file: File, type: 'avatar' | 'banner') => {
    if (!user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${type}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      return setToast({ message: "Erreur lors de l'upload", type: 'error' });
    }

    const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);

    const updateData = type === 'avatar'
      ? { avatar_pending_url: publicUrl, avatar_status: 'pending' }
      : { banner_pending_url: publicUrl, banner_status: 'pending' };

    await supabase.from('profiles').update(updateData).eq('id', user.id);

    setToast({ 
      message: `📸 Photo de ${type === 'avatar' ? 'profil' : 'couverture'} envoyée en validation`, 
      type: 'success' 
    });

    // Recharger les données pour afficher immédiatement le pending
    loadData();
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({ 
        sales_badge: salesBadge, 
        frame: frame 
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      setToast({ message: "Erreur lors de l'enregistrement", type: 'error' });
    } else {
      setToast({ message: "✅ Profil mis à jour avec succès", type: 'success' });
      loadData(); // Rafraîchir l'aperçu
    }

    setTimeout(() => setToast(null), 2500);
  };

  const toggleSalesBadge = (level: number) => {
    setSalesBadge(prev => prev === level ? null : level);
  };

  const selectFrame = (id: string) => {
    setFrame(prev => prev === id ? null : id);
  };

  const closeToast = () => setToast(null);

  if (!user || !profile) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER - Titre parfaitement centré */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/creators/me" className="flex items-center gap-2 text-zinc-400 hover:text-white transition">
            <ArrowLeft size={20} />
            Retour au profil
          </Link>

          <h1 className="text-4xl font-bold tracking-tight">Édition de profil</h1>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-pink-600 hover:bg-pink-500 px-8 py-3.5 rounded-3xl font-semibold flex items-center gap-3 transition disabled:opacity-70"
          >
            <Save size={20} />
            {saving ? "Enregistrement..." : "Enregistrer tout"}
          </button>
        </div>

        {/* TOAST Amélioré */}
        {toast && (
          <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-2xl text-base shadow-2xl flex items-center gap-3 min-w-[420px]
            ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>
            <span>{toast.message}</span>
            
            {toast.link && (
              <Link href={toast.link} className="underline text-sm ml-2">Voir →</Link>
            )}

            <button onClick={closeToast} className="ml-auto p-1 hover:bg-white/20 rounded-full">
              <X size={18} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Aperçu en direct */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-xl mb-4 text-zinc-300">Aperçu en direct</h2>
              <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-[16/9]">
                <img 
                  src={profile.banner_pending_url || profile.banner_url || "https://picsum.photos/id/1015/1200/400"} 
                  alt="Bannière" 
                  className="w-full h-full object-cover" 
                />

                {(profile.banner_status === 'pending') && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-black text-sm px-4 py-1 rounded-full flex items-center gap-2">
                    <Clock size={16} /> En attente
                  </div>
                )}

                <div className="absolute bottom-8 left-8">
                  <div className="relative inline-block">
                    <img 
                      src={profile.avatar_pending_url || profile.avatar_url || "https://picsum.photos/id/64/300/300"} 
                      alt="Avatar" 
                      className="w-32 h-32 rounded-2xl border-4 border-zinc-950 object-cover" 
                    />
                    
                    {frame && <div className={`absolute inset-0 rounded-2xl border-4 shimmer-frame ${frame}`} />}
                    
                    {salesBadge && (
                      <img 
                        src={`/badges/${salesBadge}.png`} 
                        className="absolute -top-3 -right-3 w-14 h-14 drop-shadow-xl" 
                        alt="Badge" 
                      />
                    )}

                    {(profile.avatar_status === 'pending') && (
                      <div className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock size={14} /> En attente
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Commentaires à modérer */}
            <div>
              <h2 className="text-xl mb-4">Commentaires à valider ({pendingReviews.length})</h2>
              {/* ... reste identique */}
            </div>
          </div>

          {/* Panneau de configuration */}
          <div className="lg:col-span-7 space-y-12">
            {/* Upload images */}
            <div>
              <h2 className="text-xl mb-4">Changer les images</h2>
              <div className="grid grid-cols-2 gap-6">
                <label className="cursor-pointer border-2 border-dashed border-zinc-700 hover:border-pink-500 rounded-3xl p-10 text-center transition">
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], 'banner')} className="hidden" />
                  <Camera className="mx-auto mb-3 text-pink-400" size={40} />
                  <p className="font-medium text-pink-400">Photo de couverture</p>
                </label>

                <label className="cursor-pointer border-2 border-dashed border-zinc-700 hover:border-pink-500 rounded-3xl p-10 text-center transition">
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], 'avatar')} className="hidden" />
                  <Camera className="mx-auto mb-3 text-pink-400" size={40} />
                  <p className="font-medium text-pink-400">Photo de profil</p>
                </label>
              </div>
            </div>

            {/* Badges & Cadres (inchangé mais plus propre) */}
            {/* ... le reste de tes sections badges et cadres reste quasi identique */}

          </div>
        </div>
      </div>

      {/* Styles shimmer */}
      <style jsx>{`
        @keyframes shimmer-frame {
          0% { background-position: -200% 0; }
          100% { background-position: 300% 0; }
        }
        .shimmer-frame {
          animation: shimmer-frame 8s linear infinite;
          background: linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%);
          background-size: 200% 100%;
        }
        .shimmer-frame.rose { border-color: #f472b6; box-shadow: 0 0 40px #f472b6; }
        .shimmer-frame.silver { border-color: #e2e8f0; box-shadow: 0 0 40px #e2e8f0; }
        .shimmer-frame.gold { border-color: #fbbf24; box-shadow: 0 0 45px #fbbf24; }
      `}</style>
    </div>
  );
}
