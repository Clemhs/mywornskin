'use client';

import { useState, useEffect } from 'react';
import { Check, X, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const supabase = createClient();
  const [pendingPhotos, setPendingPhotos] = useState<any[]>([]);
  const [refusedReviews, setRefusedReviews] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const loadData = async () => {
    // Photos en attente
    const { data: photos } = await supabase
      .from('profiles')
      .select('id, username, avatar_pending_url, banner_pending_url, avatar_status, banner_status')
      .or('avatar_status.eq.pending,banner_status.eq.pending');

    setPendingPhotos(photos || []);

    // Commentaires refusés par les créatrices
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*, profiles(username)')
      .eq('status', 'rejected_by_creator')
      .order('created_at', { ascending: false });

    setRefusedReviews(reviews || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePhotoAction = async (profileId: string, type: 'avatar' | 'banner', action: 'approved' | 'rejected') => {
    const updateField = type === 'avatar' ? 'avatar_status' : 'banner_status';
    const urlField = type === 'avatar' ? 'avatar_pending_url' : 'banner_pending_url';

    await supabase
      .from('profiles')
      .update({ 
        [updateField]: action,
        ...(action === 'approved' && { [`${type}_url`]: supabase.from('profiles').select(urlField).eq('id', profileId).single() })
      })
      .eq('id', profileId);

    loadData();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-10">Administration MyWornSkin</h1>

      {/* Photos en attente */}
      <div className="mb-16">
        <h2 className="text-2xl mb-6">Photos en attente de validation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pendingPhotos.map(p => (
            <div key={p.id} className="bg-zinc-900 rounded-3xl p-6">
              <p className="font-medium mb-4">{p.username}</p>
              
              {p.avatar_pending_url && (
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Photo de profil</p>
                  <img src={p.avatar_pending_url} className="w-32 h-32 rounded-2xl mb-3" />
                  <div className="flex gap-3">
                    <button onClick={() => handlePhotoAction(p.id, 'avatar', 'approved')} className="flex-1 bg-green-600 py-3 rounded-2xl">✅ Accepter</button>
                    <button onClick={() => handlePhotoAction(p.id, 'avatar', 'rejected')} className="flex-1 bg-red-600 py-3 rounded-2xl">❌ Refuser</button>
                  </div>
                </div>
              )}

              {p.banner_pending_url && (
                <div className="mt-8">
                  <p className="text-sm text-zinc-400 mb-2">Photo de couverture</p>
                  <img src={p.banner_pending_url} className="w-full h-40 object-cover rounded-2xl mb-3" />
                  <div className="flex gap-3">
                    <button onClick={() => handlePhotoAction(p.id, 'banner', 'approved')} className="flex-1 bg-green-600 py-3 rounded-2xl">✅ Accepter</button>
                    <button onClick={() => handlePhotoAction(p.id, 'banner', 'rejected')} className="flex-1 bg-red-600 py-3 rounded-2xl">❌ Refuser</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Commentaires refusés */}
      <div>
        <h2 className="text-2xl mb-6">Commentaires refusés par les créatrices</h2>
        {/* ... (je te donnerai le détail complet dans le prochain message si tu veux) */}
      </div>
    </div>
  );
}
