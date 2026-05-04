'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Save, Lock, Camera, ShoppingBag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CreatorEditPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [totalSales, setTotalSales] = useState(999);
  const [membershipMonths, setMembershipMonths] = useState(120);
  const [salesBadge, setSalesBadge] = useState<number | null>(null);
  const [frame, setFrame] = useState<string | null>(null);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [pendingAvatar, setPendingAvatar] = useState("");
  const [pendingBanner, setPendingBanner] = useState("");

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const availableSalesBadges = [10, 50, 100, 500];
  const availableFrames = [
    { id: "rose", name: "1 an", minMonths: 12 },
    { id: "silver", name: "2 ans", minMonths: 24 },
    { id: "gold", name: "5 ans", minMonths: 60 },
  ];

  // Chargement
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setTotalSales(data.total_sales || 999);
        setMembershipMonths(data.membership_months || 120);
        setSalesBadge(data.sales_badge);
        setFrame(data.frame);
        setAvatarUrl(data.avatar_url || "");
        setBannerUrl(data.banner_url || "");
      }
    };

    loadProfile();
  }, [user]);

  const toggleSalesBadge = (level: number) => {
    setSalesBadge(current => current === level ? null : level);
  };

  const selectFrame = (f: string) => {
    setFrame(current => current === f ? null : f);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPendingAvatar(URL.createObjectURL(file));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPendingBanner(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setToast(null);

    const updateData: any = {
      sales_badge: salesBadge,
      frame: frame,
      updated_at: new Date().toISOString(),
    };

    if (pendingAvatar) updateData.avatar_url = pendingAvatar;
    if (pendingBanner) updateData.banner_url = pendingBanner;

    console.log("Données envoyées :", updateData);

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      console.error("Erreur Supabase :", error);
      setToast("❌ Erreur lors de l'enregistrement : " + error.message);
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

        {toast && (
          <div className={`mb-8 p-4 rounded-3xl text-center font-medium ${toast.includes('✅') ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast}
          </div>
        )}

        {/* Le reste de ton interface (aperçu, uploads, badges, cadres, boutique) reste identique à la version précédente */}

        {/* ... (je ne recopie pas tout pour ne pas alourdir) */}

      </div>
    </div>
  );
}
