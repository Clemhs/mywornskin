'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Save, Lock, Camera, ShoppingBag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CreatorEditPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [totalSales] = useState(999);
  const [membershipMonths] = useState(120);
  const [salesBadge, setSalesBadge] = useState<number | null>(500);
  const [frame, setFrame] = useState<string | null>('gold');

  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const availableSalesBadges = [10, 50, 100, 500];
  const availableFrames = [
    { id: "rose", name: "1 an" },
    { id: "silver", name: "2 ans" },
    { id: "gold", name: "5 ans" },
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
        setSalesBadge(data.sales_badge);
        setFrame(data.frame);
        setAvatarUrl(data.avatar_url || "");
        setBannerUrl(data.banner_url || "");
      }
    };

    loadProfile();
  }, [user]);

  const toggleSalesBadge = (level: number) => setSalesBadge(current => current === level ? null : level);
  const selectFrame = (f: string) => setFrame(current => current === f ? null : f);

  const uploadImage = async (file: File, type: 'avatar' | 'banner') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${type}-${Date.now()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const publicUrl = await uploadImage(file, 'avatar');
      setAvatarUrl(publicUrl);
      setToast("✅ Photo de profil mise à jour");
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      setToast("❌ Erreur lors de l'upload de l'avatar");
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const publicUrl = await uploadImage(file, 'banner');
      setBannerUrl(publicUrl);
      setToast("✅ Couverture mise à jour");
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      setToast("❌ Erreur lors de l'upload de la couverture");
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
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      setToast("❌ Erreur lors de l'enregistrement");
    } else {
      setToast("✅ Tout a été enregistré avec succès !");
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12 pt-20">
      {/* ... le reste de ton interface (aperçu, boutons upload, badges, cadres, boutique) reste identique ... */}
      {/* Tu peux garder tout le JSX de la version précédente pour le visuel */}
    </div>
  );
}
