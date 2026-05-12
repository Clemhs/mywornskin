'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, User, Heart, Package, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, isCreator, loading } = useAuth();
  const supabase = createClient();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Redirection si pas connecté ou si créatrice
  useEffect(() => {
    if (!loading && (!user || isCreator)) {
      router.push(isCreator ? '/creators/me' : '/login');
    }
  }, [user, isCreator, loading, router]);

  // Charger l'avatar
  useEffect(() => {
    if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setToast(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Mettre à jour le profil
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      setAvatarUrl(publicUrl);
      setToast({ message: "✅ Photo de profil mise à jour !", type: 'success' });
    } catch (error) {
      setToast({ message: "❌ Erreur lors de l'upload", type: 'error' });
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-light mb-10">Mon Profil</h1>

        <div className="bg-zinc-900 rounded-3xl p-10">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-zinc-700">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <User className="w-20 h-20 text-zinc-500" />
                  </div>
                )}
              </div>

              <label className="absolute bottom-3 right-3 bg-rose-600 hover:bg-rose-500 p-3 rounded-2xl cursor-pointer transition-all shadow-xl">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Infos utilisateur */}
            <div className="flex-1 pt-2">
              <h2 className="text-3xl font-semibold">
                {profile?.full_name || user?.user_metadata?.full_name || 'Client'}
              </h2>
              <p className="text-zinc-400 mt-1">{user?.email}</p>
              <p className="text-emerald-400 text-sm mt-3 flex items-center gap-2">
                ✓ Compte Client
              </p>

              {toast && (
                <div className={`mt-6 px-6 py-4 rounded-2xl text-sm ${
                  toast.type === 'success' 
                    ? 'bg-green-900/30 border border-green-500 text-green-400' 
                    : 'bg-red-900/30 border border-red-500 text-red-400'
                }`}>
                  {toast.message}
                </div>
              )}
            </div>
          </div>

          {/* Navigation rapide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <button 
              onClick={() => router.push('/profile/favorites')}
              className="bg-zinc-800 hover:bg-zinc-700 transition p-6 rounded-3xl flex flex-col items-center gap-3"
            >
              <Heart className="w-8 h-8 text-rose-400" />
              <span className="font-medium">Mes Favoris</span>
            </button>

            <button 
              onClick={() => router.push('/orders')}
              className="bg-zinc-800 hover:bg-zinc-700 transition p-6 rounded-3xl flex flex-col items-center gap-3"
            >
              <Package className="w-8 h-8 text-rose-400" />
              <span className="font-medium">Mes Commandes</span>
            </button>

            <button 
              className="bg-zinc-800 hover:bg-zinc-700 transition p-6 rounded-3xl flex flex-col items-center gap-3"
            >
              <Settings className="w-8 h-8 text-rose-400" />
              <span className="font-medium">Paramètres</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
