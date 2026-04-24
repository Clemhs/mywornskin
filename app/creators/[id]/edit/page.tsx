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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Charger les données du créateur
  useEffect(() => {
    const loadCreator = async () => {
      const { data } = await supabase
        .from('creators')
        .select('*')
        .eq('id', id)
        .single();

      setCreator(data || {});
      setLoading(false);
    };
    loadCreator();
  }, [id]);

  const handleFileUpload = async (file: File, type: 'avatar' | 'banner') => {
    if (!file) return;

    const bucket = type === 'avatar' ? 'avatars' : 'banners';
    const fileName = `${type}-${id}-${Date.now()}-${file.name}`;

    setSaving(true);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      showToast('❌ Erreur lors de l’upload', 'error');
      setSaving(false);
      return;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);

    // Mise à jour du champ pending
    const updateField = type === 'avatar' ? 'pending_avatar_url' : 'pending_banner_url';
    await supabase
      .from('creators')
      .update({ [updateField]: urlData.publicUrl })
      .eq('id', id);

    // Mise à jour locale pour preview
    setCreator((prev: any) => ({
      ...prev,
      [updateField]: urlData.publicUrl
    }));

    showToast(`✅ ${type === 'avatar' ? 'Photo de profil' : 'Couverture'} mise en attente de validation`, 'success');
    setSaving(false);
  };

  const handleSave = async () => {
    setSaving(true);
    showToast('✅ Modifications enregistrées (badges, cadres, etc. seront sauvegardés bientôt)', 'success');
    setSaving(false);
    // Ici on pourra plus tard sauvegarder les badges/cadres
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Personnaliser mon profil</h1>
          <Link href={`/creators/${id}`} className="text-rose-400 hover:text-white">← Retour au profil</Link>
        </div>

        {/* Preview */}
        <div className="relative h-64 rounded-3xl overflow-hidden mb-8 border border-zinc-800">
          <img
            src={creator.pending_banner_url || creator.banner_url || "https://picsum.photos/id/1005/1200/400"}
            alt="Bannière"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 flex items-end gap-4">
            <img
              src={creator.pending_avatar_url || creator.avatar_url || "https://picsum.photos/id/1011/280/280"}
              alt="Avatar"
              className="w-24 h-24 rounded-2xl border-4 border-zinc-950 object-cover"
            />
          </div>
        </div>

        {/* Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Photo de profil</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'avatar')}
              className="block w-full text-sm text-zinc-400 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-medium file:bg-rose-600 file:text-white hover:file:bg-rose-500"
            />
            {creator.pending_avatar_url && <p className="mt-2 text-amber-400 text-sm">⏳ En attente de validation</p>}
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Image de couverture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'banner')}
              className="block w-full text-sm text-zinc-400 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-medium file:bg-rose-600 file:text-white hover:file:bg-rose-500"
            />
            {creator.pending_banner_url && <p className="mt-2 text-amber-400 text-sm">⏳ En attente de validation</p>}
          </div>
        </div>

        {/* Bouton principal de sauvegarde */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-700 rounded-3xl text-lg font-semibold transition-all flex items-center justify-center gap-3"
        >
          {saving ? (
            <>Enregistrement en cours...</>
          ) : (
            <>Enregistrer les modifications</>
          )}
        </button>

        {toast && (
          <div className={`fixed bottom-6 right-6 px-8 py-4 rounded-3xl shadow-2xl text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
