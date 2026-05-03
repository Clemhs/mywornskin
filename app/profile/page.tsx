'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, User } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    // Simulation pour l'instant (on branchera Supabase plus tard)
    const mockUser = {
      id: "user123",
      email: "client@exemple.com",
      user_metadata: { full_name: "Alex Martin" }
    };
    setUser(mockUser);
    setAvatarUrl(null); // Tu pourras uploader plus tard
  }, [router]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setToast(null);

    // Simulation upload
    setTimeout(() => {
      setAvatarUrl(URL.createObjectURL(file));
      setToast("✅ Photo de profil mise à jour avec succès !");
      setUploading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">

      <div className="max-w-4xl mx-auto px-6 pb-20">
        <h1 className="text-4xl font-bold mb-10">Mon Profil Client</h1>

        <div className="bg-zinc-900 rounded-3xl p-10">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="relative group">
              <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-zinc-700">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <User className="w-20 h-20 text-zinc-500" />
                  </div>
                )}
              </div>

              <label className="absolute bottom-3 right-3 bg-rose-600 hover:bg-rose-500 p-3 rounded-2xl cursor-pointer transition-all shadow-lg">
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

            <div>
              <h2 className="text-3xl font-semibold">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Client'}
              </h2>
              <p className="text-zinc-400 mt-1">{user?.email}</p>
              <p className="text-emerald-400 text-sm mt-3">✓ Compte Client</p>
            </div>
          </div>

          {toast && (
            <div className={`mt-8 px-6 py-4 rounded-2xl ${toast.includes('✅') ? 'bg-green-600/20 border border-green-500 text-green-400' : 'bg-red-600/20 border border-red-500 text-red-400'}`}>
              {toast}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
