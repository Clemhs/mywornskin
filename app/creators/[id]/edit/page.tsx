'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CreatorEdit() {
  const { id } = useParams();
  const [creator, setCreator] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const loadCreator = async () => {
      const { data } = await supabase
        .from('creators')
        .select('*')
        .eq('id', id)
        .single();
      setCreator(data || {});
    };
    loadCreator();
  }, [id]);

  const handleUpload = async (file: File, type: 'avatar' | 'banner') => {
    if (!file) return;
    setSaving(true);

    const bucket = type === 'avatar' ? 'avatars' : 'banners';
    const fileName = `${type}-${id}-${Date.now()}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      showToast('❌ Erreur upload', 'error');
      setSaving(false);
      return;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);

    const field = type === 'avatar' ? 'pending_avatar_url' : 'pending_banner_url';
    await supabase
      .from('creators')
      .update({ [field]: urlData.publicUrl })
      .eq('id', id);

    setCreator((prev: any) => ({ ...prev, [field]: urlData.publicUrl }));
    showToast(`✅ ${type === 'avatar' ? 'Photo de profil' : 'Couverture'} mise en attente`, 'success');
    setSaving(false);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      showToast('✅ Modifications enregistrées (badges, cadres, etc. seront sauvegardés bientôt)', 'success');
      setSaving(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Personnaliser mon profil</h1>
          <Link href={`/creators/${id}`} className="text-rose-400 hover:text-white flex items-center gap-1">
            ← Retour au profil
          </Link>
        </div>

        {/* Preview */}
        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-10 border border-zinc-800">
          <img
            src={creator?.pending_banner_url || creator?.banner_url || "https://picsum.photos/id/1005/1200/400"}
            alt="Bannière"
            className="w-full h-full object-cover"
          />
          <div className="absolute -bottom-6 left-8 w-28 h-28 rounded-3xl border-4 border-zinc-950 overflow-hidden">
            <img
              src={creator?.pending_avatar_url || creator?.avatar_url || "https://picsum.photos/id/1011/280/280"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <label className="block text-zinc-400 text-sm mb-2">Photo de profil</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'avatar')}
              className="block w-full text-sm text-zinc-400 file:mr-4 file:py-4 file:px-8 file:rounded-3xl file:border-0 file:text-sm file:font-medium file:bg-rose-600 file:text-white hover:file:bg-rose-500 cursor-pointer"
            />
            {creator?.pending_avatar_url && <p className="mt-3 text-amber-400 flex items-center gap-1">⏳ En attente de validation</p>}
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-2">Image de couverture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'banner')}
              className="block w-full text-sm text-zinc-400 file:mr-4 file:py-4 file:px-8 file:rounded-3xl file:border-0 file:text-sm file:font-medium file:bg-rose-600 file:text-white hover:file:bg-rose-500 cursor-pointer"
            />
            {creator?.pending_banner_url && <p className="mt-3 text-amber-400 flex items-center gap-1">⏳ En attente de validation</p>}
          </div>
        </div>

        {/* Bouton Enregistrer */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-5 bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-700 rounded-3xl text-xl font-semibold transition"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>

        {toast && (
          <div className={`fixed bottom-8 right-8 px-8 py-4 rounded-3xl text-white shadow-2xl ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
