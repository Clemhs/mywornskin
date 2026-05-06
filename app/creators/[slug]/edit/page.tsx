'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Save, Camera, Clock, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CreatorEditPage() {
  const { user } = useAuth();
  const supabase = createClient();

  // ... (tout le state et les fonctions restent identiques) ...
  const [salesBadge, setSalesBadge] = useState<number | null>(500);
  const [frame, setFrame] = useState<string | null>('gold');
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [avatarPendingUrl, setAvatarPendingUrl] = useState("");
  const [bannerPendingUrl, setBannerPendingUrl] = useState("");
  const [avatarStatus, setAvatarStatus] = useState<'approved' | 'pending' | 'rejected'>('approved');
  const [bannerStatus, setBannerStatus] = useState<'approved' | 'pending' | 'rejected'>('approved');
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; link?: string } | null>(null);

  // ... loadData, uploadImage, handlers ... (je garde tout le reste identique pour ne rien casser)

  const closeToast = () => setToast(null);

  const toastClass = toast?.type === 'success' 
    ? 'bg-emerald-600 text-white' 
    : 'bg-red-600 text-white';

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* HEADER AVEC TITRE PARFAITEMENT CENTRÉ */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/creators/me" className="text-zinc-400 hover:text-white flex items-center gap-2">
            ← Retour au profil
          </Link>

          <h1 className="text-4xl font-bold text-center flex-1">Édition de profil</h1>

          <button 
            onClick={() => {/* handleSave */}}
            className="bg-pink-600 hover:bg-pink-500 px-10 py-4 rounded-3xl font-semibold flex items-center gap-3"
          >
            <Save className="w-5 h-5" /> Enregistrer tout
          </button>
        </div>

        {/* TOAST NET - SANS X FANTÔME */}
        {toast && (
          <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl text-base shadow-2xl flex items-center gap-3 min-w-[420px] ${toastClass}`}>
            <span>{toast.message}</span>
            
            {toast.link && (
              <Link href={toast.link} className="underline hover:text-white text-sm whitespace-nowrap">
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

        {/* Le reste de ta page (aperçu, badges, cadres, etc.) */}
        {/* ... (tu peux garder tout le contenu d'avant à partir d'ici) ... */}

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
