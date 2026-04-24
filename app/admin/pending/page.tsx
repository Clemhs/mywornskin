'use client';
// Pending page - Version finale et propre
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Pending() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .or('pending_avatar_url.not.is.null,pending_banner_url.not.is.null')
      .order('created_at', { ascending: false });

    if (error) console.error('Erreur pending:', error);
    else setCreators(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const approve = async (creatorId: string, type: 'avatar' | 'banner') => {
    const creator = creators.find((c: any) => c.id === creatorId);
    if (!creator) return;

    const updateData: any = {};
    if (type === 'avatar') {
      updateData.avatar_url = creator.pending_avatar_url;
      updateData.pending_avatar_url = null;
    } else {
      updateData.banner_url = creator.pending_banner_url;
      updateData.pending_banner_url = null;
    }

    const { error } = await supabase
      .from('creators')
      .update(updateData)
      .eq('id', creatorId);

    if (!error) fetchPending();
  };

  const reject = async (creatorId: string, type: 'avatar' | 'banner') => {
    const updateData: any = type === 'avatar' 
      ? { pending_avatar_url: null } 
      : { pending_banner_url: null };

    const { error } = await supabase
      .from('creators')
      .update(updateData)
      .eq('id', creatorId);

    if (!error) fetchPending();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Validations en attente</h1>

        {loading && <p className="text-zinc-400">Chargement...</p>}

        {!loading && creators.length === 0 && (
          <p className="text-zinc-400 text-lg">Aucune demande en attente pour le moment 🎉</p>
        )}

        <div className="space-y-12">
          {creators.map((creator: any) => (
            <div key={creator.id} className="bg-zinc-900 rounded-3xl p-8">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl">Créateur <span className="font-mono text-pink-400">{creator.id}</span></h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Avatar en attente */}
                {creator.pending_avatar_url && (
                  <div>
                    <p className="text-sm text-zinc-400 mb-3">Photo de profil en attente</p>
                    <img src={creator.pending_avatar_url} alt="pending avatar" className="w-48 h-48 object-cover rounded-2xl border-2 border-pink-500" />
                    <div className="flex gap-4 mt-6">
                      <button onClick={() => approve(creator.id, 'avatar')} className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-medium">✅ Approuver</button>
                      <button onClick={() => reject(creator.id, 'avatar')} className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-medium">❌ Refuser</button>
                    </div>
                  </div>
                )}

                {/* Bannière en attente */}
                {creator.pending_banner_url && (
                  <div>
                    <p className="text-sm text-zinc-400 mb-3">Image de couverture en attente</p>
                    <img src={creator.pending_banner_url} alt="pending banner" className="w-full max-h-64 object-cover rounded-2xl border-2 border-pink-500" />
                    <div className="flex gap-4 mt-6">
                      <button onClick={() => approve(creator.id, 'banner')} className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-medium">✅ Approuver</button>
                      <button onClick={() => reject(creator.id, 'banner')} className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-medium">❌ Refuser</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
