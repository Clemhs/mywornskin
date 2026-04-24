'use client';

// V4 - Admin Pending - Validation réelle dans Supabase

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPending() {
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadPending = async () => {
    const { data } = await supabase
      .from('creators')
      .select('id, username, pending_avatar_url, pending_banner_url')
      .or('pending_avatar_url.is.null,pending_banner_url.is.null')
      .not('pending_avatar_url', 'is', null)
      .or('pending_avatar_url.is.null,pending_banner_url.is.null')
      .not('pending_banner_url', 'is', null);

    setPendingItems(data || []);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (creatorId: string, type: 'avatar' | 'banner') => {
    const updateData = type === 'avatar' 
      ? { avatar_url: pendingItems.find(i => i.id === creatorId)?.pending_avatar_url, pending_avatar_url: null }
      : { banner_url: pendingItems.find(i => i.id === creatorId)?.pending_banner_url, pending_banner_url: null };

    const { error } = await supabase
      .from('creators')
      .update(updateData)
      .eq('id', creatorId);

    if (error) {
      showToast('❌ Erreur lors de la validation', 'error');
      return;
    }

    showToast('✅ Image validée avec succès', 'success');
    loadPending(); // rafraîchir la liste
  };

  const handleReject = async (creatorId: string, type: 'avatar' | 'banner') => {
    const updateData = type === 'avatar' 
      ? { pending_avatar_url: null }
      : { pending_banner_url: null };

    await supabase
      .from('creators')
      .update(updateData)
      .eq('id', creatorId);

    showToast('❌ Image refusée', 'error');
    loadPending();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Validations en attente</h1>
          <Link href="/" className="text-zinc-400 hover:text-white">← Retour au site</Link>
        </div>

        <p className="text-zinc-400 mb-8">Vous avez {pendingItems.length} demande(s) en attente</p>

        {toast && (
          <div className={`fixed top-6 right-6 px-8 py-4 rounded-2xl text-white shadow-2xl z-50 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast.message}
          </div>
        )}

        <div className="space-y-6">
          {pendingItems.map((item) => (
            <div key={item.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <Link href={`/creators/${item.id}`} className="font-semibold text-lg hover:text-rose-400">
                  {item.username}
                </Link>
              </div>

              {item.pending_avatar_url && (
                <div className="mb-8">
                  <p className="text-xs text-rose-400 mb-2">Photo de profil proposée</p>
                  <div className="grid grid-cols-2 gap-6">
                    <img src={item.avatar_url || "https://picsum.photos/id/1011/280/280"} alt="actuelle" className="rounded-2xl" />
                    <img src={item.pending_avatar_url} alt="proposée" className="rounded-2xl border-2 border-rose-400" />
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button onClick={() => handleApprove(item.id, 'avatar')} className="flex-1 bg-green-600 hover:bg-green-500 py-3 rounded-2xl">✅ Valider avatar</button>
                    <button onClick={() => handleReject(item.id, 'avatar')} className="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-2xl">❌ Refuser avatar</button>
                  </div>
                </div>
              )}

              {item.pending_banner_url && (
                <div>
                  <p className="text-xs text-rose-400 mb-2">Image de couverture proposée</p>
                  <div className="grid grid-cols-2 gap-6">
                    <img src={item.banner_url || "https://picsum.photos/id/1005/1200/400"} alt="actuelle" className="rounded-2xl" />
                    <img src={item.pending_banner_url} alt="proposée" className="rounded-2xl border-2 border-rose-400" />
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button onClick={() => handleApprove(item.id, 'banner')} className="flex-1 bg-green-600 hover:bg-green-500 py-3 rounded-2xl">✅ Valider couverture</button>
                    <button onClick={() => handleReject(item.id, 'banner')} className="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-2xl">❌ Refuser couverture</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {pendingItems.length === 0 && (
          <div className="text-center py-20 text-zinc-400 text-lg">
            Aucune demande en attente pour le moment 🎉
          </div>
        )}
      </div>
    </div>
  );
}
