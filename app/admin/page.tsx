'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Save, Camera } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CreatorEditPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [avatarUrl, setAvatarUrl] = useState("");
  const [pendingAvatar, setPendingAvatar] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url, avatar_pending_url, avatar_status')
      .eq('id', user!.id)
      .single();

    if (data) {
      setAvatarUrl(data.avatar_url || "");
      setPendingAvatar(data.avatar_pending_url || "");
    }
  };

  const uploadAndSavePhoto = async (file: File) => {
    if (!user) return;

    const fileName = `${user.id}-avatar-${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      setToast("Erreur upload");
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_pending_url: publicUrl,
        avatar_status: 'pending'
      })
      .eq('id', user.id);

    if (updateError) {
      setToast("Erreur sauvegarde");
    } else {
      setPendingAvatar(publicUrl);
      setToast("✅ Photo envoyée en attente !");
      setTimeout(() => setToast(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-md mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">Test Photo</h1>

        <div className="mb-8">
          <img 
            src={pendingAvatar || avatarUrl || "https://picsum.photos/id/64/300/300"} 
            className="w-64 h-64 object-cover rounded-3xl mx-auto border-4 border-zinc-700" 
          />
        </div>

        <label className="block bg-zinc-900 border border-dashed border-pink-500 rounded-3xl p-12 text-center cursor-pointer hover:border-pink-400">
          <Camera className="mx-auto mb-4 text-pink-400" size={48} />
          <span className="text-pink-400 font-medium">Changer la photo de profil</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => e.target.files?.[0] && uploadAndSavePhoto(e.target.files[0])} 
            className="hidden" 
          />
        </label>

        {toast && <div className="mt-6 text-center text-lg">{toast}</div>}
      </div>
    </div>
  );
}
