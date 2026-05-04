'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Save, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CreatorEditPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [totalSales, setTotalSales] = useState(0);
  const [membershipMonths, setMembershipMonths] = useState(0);
  const [salesBadge, setSalesBadge] = useState<number | null>(null);
  const [frame, setFrame] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const availableSalesBadges = [10, 50, 100, 500];
  const availableFrames = [
    { id: "rose", name: "1 an", minMonths: 12 },
    { id: "silver", name: "2 ans", minMonths: 24 },
    { id: "gold", name: "5 ans", minMonths: 60 },
  ];

  // Chargement des données
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('total_sales, membership_months, sales_badge, frame')
        .eq('id', user.id)
        .single();

      if (data) {
        setTotalSales(data.total_sales || 0);
        setMembershipMonths(data.membership_months || 0);
        setSalesBadge(data.sales_badge);
        setFrame(data.frame);
      }
    };

    loadProfile();
  }, [user]);

  const isBadgeUnlocked = (level: number) => totalSales >= level;
  const isFrameUnlocked = (minMonths: number) => membershipMonths >= minMonths;

  const toggleSalesBadge = (level: number) => {
    if (!isBadgeUnlocked(level)) return;
    setSalesBadge(current => current === level ? null : level);
  };

  const selectFrame = (f: string) => {
    const frameData = availableFrames.find(fr => fr.id === f);
    if (frameData && isFrameUnlocked(frameData.minMonths)) {
      setFrame(current => current === f ? null : f); // Permet de désactiver en recliquant
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        sales_badge: salesBadge,
        frame: frame,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      setToast("❌ Erreur lors de l'enregistrement");
    } else {
      setToast("✅ Modifications enregistrées avec succès !");
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12 pt-20">
      <div className="max-w-6xl mx-auto px-6 pt-4">
        <div className="flex justify-between items-center mb-10">
          <Link href={`/creators/me`} className="text-zinc-400 hover:text-white flex items-center gap-2">
            ← Retour au profil
          </Link>
          <h1 className="text-3xl font-semibold">Mon profil</h1>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-pink-600 hover:bg-pink-500 px-8 py-3 rounded-3xl font-medium disabled:opacity-70 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>

        {toast && <div className="mb-8 p-4 bg-green-600 rounded-3xl text-center">{toast}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Aperçu en direct */}
          <div className="lg:col-span-5">
            <h2 className="text-xl mb-4">Aperçu en direct</h2>
            <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-video">
              <img src="https://picsum.photos/id/1015/1200/400" alt="Bannière" className="w-full h-full object-cover" />
              {frame && <div className={`absolute inset-0 rounded-3xl border-4 shimmer-frame ${frame}`} />}
              
              <div className="absolute bottom-8 left-8">
                <div className="relative">
                  <img src="https://picsum.photos/id/64/300/300" alt="Avatar" className="w-32 h-32 rounded-2xl border-4 border-zinc-950 object-cover" />
                  {salesBadge && <img src={`/badges/${salesBadge}.png`} className="absolute -top-3 -right-3 w-12 h-12 drop-shadow-2xl z-10" />}
                </div>
              </div>
            </div>
          </div>

          {/* Badges de ventes */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <h2 className="text-xl mb-4">Badges de ventes</h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {availableSalesBadges.map(level => {
                  const unlocked = isBadgeUnlocked(level);
                  const isSelected = salesBadge === level;
                  return (
                    <button
                      key={level}
                      onClick={() => toggleSalesBadge(level)}
                      disabled={!unlocked}
                      className={`flex-shrink-0 w-28 h-28 rounded-3xl flex flex-col items-center justify-center border-2 transition-all relative ${
                        isSelected ? 'border-pink-400 bg-pink-900/30' : unlocked ? 'border-zinc-700 hover:border-pink-400' : 'border-zinc-700 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <img src={`/badges/${level}.png`} className="w-14 h-14 mb-1" />
                      <span className="text-sm">{level} ventes</span>
                      {!unlocked && <Lock className="absolute top-3 right-3 w-5 h-5 text-zinc-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cadres d'ancienneté - Version améliorée */}
            <div>
              <h2 className="text-xl mb-4">Cadres d'ancienneté</h2>
              <div className="flex gap-6 overflow-x-auto pb-6">
                {availableFrames.map(f => {
                  const unlocked = isFrameUnlocked(f.minMonths);
                  const isSelected = frame === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => selectFrame(f.id)}
                      disabled={!unlocked}
                      className={`flex-shrink-0 relative w-28 h-28 rounded-3xl overflow-hidden border-2 transition-all ${
                        isSelected ? 'border-pink-400 scale-95' : unlocked ? 'border-zinc-700 hover:border-pink-400' : 'border-zinc-700 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className={`shimmer-frame absolute inset-0 rounded-3xl ${f.id}`} />
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black/80 text-xs px-3 py-1 rounded-full">
                        {f.name}
                      </div>
                      {!unlocked && <Lock className="absolute top-3 right-3 w-5 h-5 text-zinc-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles pour les cadres */}
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
