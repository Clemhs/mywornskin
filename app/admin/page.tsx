'use client';

import { useState, useEffect, useMemo } from 'react';
import { MessageCircle, AlertTriangle, Image as ImageIcon, Send, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'photos' | 'reviews' | 'messages'>('photos');

  const [pendingPhotos, setPendingPhotos] = useState<any[]>([]);
  const [refusedReviews, setRefusedReviews] = useState<any[]>([]);
  const [adminMessages, setAdminMessages] = useState<any[]>([]);

  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [adminReply, setAdminReply] = useState("");

  const loadData = async () => {
    if (activeTab === 'photos') {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, banner_url, avatar_pending_url, banner_pending_url, avatar_status, banner_status')
        .or('avatar_status.eq.pending,banner_status.eq.pending');
      setPendingPhotos(data || []);
    }

    if (activeTab === 'reviews') {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'rejected')
        .order('created_at', { ascending: false });
      setRefusedReviews(data || []);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // ==================== PHOTOS ====================
  const handlePhotoAction = async (
    profileId: string, 
    type: 'avatar' | 'banner', 
    action: 'approved' | 'rejected'
  ) => {
    const pendingField = type === 'avatar' ? 'avatar_pending_url' : 'banner_pending_url';
    const mainField = type === 'avatar' ? 'avatar_url' : 'banner_url';
    const statusField = type === 'avatar' ? 'avatar_status' : 'banner_status';

    // Récupérer d'abord l'URL en attente
    const { data: profile } = await supabase
      .from('profiles')
      .select(pendingField)
      .eq('id', profileId)
      .single();

    if (action === 'approved' && profile?.[pendingField]) {
      // Copier l'URL en attente vers l'URL définitive
      await supabase
        .from('profiles')
        .update({
          [mainField]: profile[pendingField],     // ← C'était ça qui manquait !
          [pendingField]: null,
          [statusField]: 'approved'
        })
        .eq('id', profileId);
    } else {
      // Refuser = on supprime juste le pending
      await supabase
        .from('profiles')
        .update({
          [pendingField]: null,
          [statusField]: 'rejected'
        })
        .eq('id', profileId);
    }

    loadData();
  };

  // ==================== REVIEWS (inchangé) ====================
  const forcePublishReview = async (reviewId: string) => {
    await supabase.from('reviews').update({ status: 'approved' }).eq('id', reviewId);
    loadData();
  };

  const ignoreReview = async (reviewId: string) => {
    await supabase.from('reviews').update({ status: 'ignored' }).eq('id', reviewId);
    loadData();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Administration MyWornSkin</h1>

        {/* Onglets */}
        <div className="flex border-b border-zinc-800 mb-10">
          <button onClick={() => setActiveTab('photos')} className={`px-8 py-4 font-medium flex items-center gap-3 ${activeTab === 'photos' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400'}`}>
            <ImageIcon size={22} /> Photos en attente
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`px-8 py-4 font-medium flex items-center gap-3 ${activeTab === 'reviews' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400'}`}>
            <AlertTriangle size={22} /> Commentaires refusés
          </button>
        </div>

        {/* PHOTOS */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pendingPhotos.length === 0 ? (
              <p className="text-zinc-500 text-xl">Aucune photo en attente de validation.</p>
            ) : (
              pendingPhotos.map(p => (
                <div key={p.id} className="bg-zinc-900 rounded-3xl p-8">
                  <h3 className="font-semibold text-xl mb-6">@{p.username}</h3>

                  {p.avatar_pending_url && (
                    <div className="mb-12">
                      <p className="text-pink-400 mb-4">Photo de profil</p>
                      <img src={p.avatar_pending_url} className="w-48 h-48 rounded-2xl object-cover mb-6" />
                      <div className="flex gap-4">
                        <button 
                          onClick={() => handlePhotoAction(p.id, 'avatar', 'approved')}
                          className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-medium"
                        >
                          ✅ Valider
                        </button>
                        <button 
                          onClick={() => handlePhotoAction(p.id, 'avatar', 'rejected')}
                          className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-medium"
                        >
                          ❌ Refuser
                        </button>
                      </div>
                    </div>
                  )}

                  {p.banner_pending_url && (
                    <div>
                      <p className="text-pink-400 mb-4">Photo de couverture</p>
                      <img src={p.banner_pending_url} className="w-full h-64 object-cover rounded-2xl mb-6" />
                      <div className="flex gap-4">
                        <button 
                          onClick={() => handlePhotoAction(p.id, 'banner', 'approved')}
                          className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-medium"
                        >
                          ✅ Valider
                        </button>
                        <button 
                          onClick={() => handlePhotoAction(p.id, 'banner', 'rejected')}
                          className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-medium"
                        >
                          ❌ Refuser
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Autres onglets... */}
      </div>
    </div>
  );
}
