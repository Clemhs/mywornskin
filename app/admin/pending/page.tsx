'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPending() {
  const [items, setItems] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const loadPending = async () => {
    const { data } = await supabase
      .from('creators')
      .select('id, username, pending_avatar_url, pending_banner_url, avatar_url, banner_url')
      .or('pending_avatar_url.not.is.null,pending_banner_url.not.is.null');

    setItems(data || []);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const approve = async (creatorId: string, type: 'avatar' | 'banner') => {
    const field = type === 'avatar' ? 'pending_avatar_url' : 'pending_banner_url';
    const targetField = type === 'avatar' ? 'avatar_url' : 'banner_url';

    const { data: row } = await supabase
      .from('creators')
      .select(field)
      .eq('id', creatorId)
      .single();

    if (row && row[field]) {
      await supabase
        .from('creators')
        .update({ 
          [targetField]: row[field],
          [field]: null 
        })
        .eq('id', creatorId);
    }

    setToast('✅ Image validée');
    setTimeout(() => setToast(null), 2500);
    loadPending();
  };

  const reject = async (creatorId: string, type: 'avatar' | 'banner') => {
    const field = type === 'avatar' ? 'pending_avatar_url' : 'pending_banner_url';
    await supabase
      .from('creators')
      .update({ [field]: null })
      .eq('id', creatorId);

    setToast('❌ Image refusée');
    setTimeout(() => setToast(null), 2500);
    loadPending();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Validations en attente</h1>
          <Link href="/" className="text-zinc-400 hover:text-white">← Retour au site</Link>
        </div>

        <p className="text-zinc-400 mb-8">Vous avez {items.length} demande(s) en attente</p>

        {toast && (
          <div className="fixed top-6 right-6 px-8 py-4 rounded-3xl text-white shadow-2xl z-50 bg-green-600">
            {toast}
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-20 text-zinc-400 text-lg">
            Aucune demande en attente pour le moment 🎉
          </div>
        ) : (
          <div className="space-y-8">
            {items.map((item) => (
              <div key={item.id} className="bg-zinc-900 rounded-3xl p-6">
                <Link href={`/creators/${item.id}`} className="font-semibold text-xl hover:text-rose-400">
                  {item.username}
                </Link>

                {item.pending_avatar_url && (
                  <div className="mt-8">
                    <p className="text-amber-400 mb-3">📸 Photo de profil proposée</p>
                    <div className="grid grid-cols-2 gap-6">
                      <img src={item.avatar_url} alt="actuelle" className="rounded-2xl" />
                      <img src={item.pending_avatar_url} alt="proposée" className="rounded-2xl border-2 border-amber-400" />
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button onClick={() => approve(item.id, 'avatar')} className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-medium">✅ Valider avatar</button>
                      <button onClick={() => reject(item.id, 'avatar')} className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-medium">❌ Refuser avatar</button>
                    </div>
                  </div>
                )}

                {item.pending_banner_url && (
                  <div className="mt-8">
                    <p className="text-amber-400 mb-3">🖼️ Image de couverture proposée</p>
                    <div className="grid grid-cols-2 gap-6">
                      <img src={item.banner_url} alt="actuelle" className="rounded-2xl" />
                      <img src={item.pending_banner_url} alt="proposée" className="rounded-2xl border-2 border-amber-400" />
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button onClick={() => approve(item.id, 'banner')} className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-medium">✅ Valider couverture</button>
                      <button onClick={() => reject(item.id, 'banner')} className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-medium">❌ Refuser couverture</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
