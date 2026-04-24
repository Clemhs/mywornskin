'use client';
// Pending page - Version corrigée (Approuver fonctionne correctement)
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Pending() {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('creators')
      .select('*')
      .or('pending_avatar_url.not.is.null,pending_banner_url.not.is.null');
    setCreators(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // ✅ CORRECTION : on copie bien la photo pending vers la photo définitive
  const approve = async (id: string, type: 'avatar' | 'banner') => {
    const creator = creators.find((c: any) => c.id === id);
    if (!creator) return;

    const updateData: any = { rejection_message: null };

    if (type === 'avatar' && creator.pending_avatar_url) {
      updateData.avatar_url = creator.pending_avatar_url;
      updateData.pending_avatar_url = null;
    }
    if (type === 'banner' && creator.pending_banner_url) {
      updateData.banner_url = creator.pending_banner_url;
      updateData.pending_banner_url = null;
    }

    const { error } = await supabase.from('creators').update(updateData).eq('id', id);
    if (!error) fetchPending();
  };

  const reject = async (id: string, type: 'avatar' | 'banner') => {
    const updateData: any = type === 'avatar' 
      ? { pending_avatar_url: null, rejection_message: "Votre photo de profil a été refusée. Veuillez en uploader une autre." }
      : { pending_banner_url: null, rejection_message: "Votre image de couverture a été refusée. Veuillez en uploader une autre." };

    const { error } = await supabase.from('creators').update(updateData).eq('id', id);
    if (!error) fetchPending();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Validations en attente</h1>

        {loading && <p>Chargement...</p>}
        {!loading && creators.length === 0 && <p className="text-zinc-400">Aucune demande en attente 🎉</p>}

        {creators.map((c: any) => (
          <div key={c.id} className="bg-zinc-900 rounded-3xl p-8 mb-8">
            <h2 className="text-xl mb-6">Créateur <span className="font-mono text-pink-400">{c.id}</span></h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {c.pending_avatar_url && (
                <div>
                  <p className="text-amber-400 mb-3">Photo de profil en attente</p>
                  <img src={c.pending_avatar_url} className="w-48 h-48 object-cover rounded-2xl" />
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => approve(c.id, 'avatar')} className="flex-1 bg-green-600 py-4 rounded-2xl">✅ Approuver</button>
                    <button onClick={() => reject(c.id, 'avatar')} className="flex-1 bg-red-600 py-4 rounded-2xl">❌ Refuser</button>
                  </div>
                </div>
              )}
              {c.pending_banner_url && (
                <div>
                  <p className="text-amber-400 mb-3">Image de couverture en attente</p>
                  <img src={c.pending_banner_url} className="w-full max-h-64 object-cover rounded-2xl" />
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => approve(c.id, 'banner')} className="flex-1 bg-green-600 py-4 rounded-2xl">✅ Approuver</button>
                    <button onClick={() => reject(c.id, 'banner')} className="flex-1 bg-red-600 py-4 rounded-2xl">❌ Refuser</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
