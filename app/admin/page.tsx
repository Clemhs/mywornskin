'use client';

import { useState, useEffect, useMemo } from 'react';
import { MessageCircle, AlertTriangle, Image as ImageIcon, Send, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'photos' | 'reviews' | 'messages'>('reviews');

  const [pendingPhotos, setPendingPhotos] = useState<any[]>([]);
  const [refusedReviews, setRefusedReviews] = useState<any[]>([]);
  const [adminMessages, setAdminMessages] = useState<any[]>([]);

  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [adminReply, setAdminReply] = useState("");

  // Chargement des données
  const loadData = async () => {
    if (activeTab === 'photos') {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, avatar_pending_url, banner_pending_url, avatar_status, banner_status')
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

    if (activeTab === 'messages') {
      const { data } = await supabase
        .from('admin_messages')
        .select('*')
        .order('created_at', { ascending: false });
      setAdminMessages(data || []);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Compteur par créatrice
  const creatorRefusalCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    refusedReviews.forEach(r => {
      counts[r.creator_id] = (counts[r.creator_id] || 0) + 1;
    });
    return counts;
  }, [refusedReviews]);

  const forcePublishReview = async (reviewId: string) => {
    await supabase.from('reviews').update({ status: 'approved' }).eq('id', reviewId);
    loadData();
  };

  const ignoreReview = async (reviewId: string) => {
    await supabase.from('reviews').update({ status: 'ignored' }).eq('id', reviewId);
    loadData();
  };

  const handlePhotoAction = async (profileId: string, type: 'avatar' | 'banner', action: 'approved' | 'rejected') => {
    const field = type === 'avatar' ? 'avatar_status' : 'banner_status';
    const pendingField = type === 'avatar' ? 'avatar_pending_url' : 'banner_pending_url';

    await supabase
      .from('profiles')
      .update({ [field]: action, [pendingField]: null })
      .eq('id', profileId);
    loadData();
  };

  const sendAdminMessage = async () => {
    if (!selectedReview || !adminReply.trim()) return;

    await supabase.from('admin_messages').insert({
      review_id: selectedReview.id,
      creator_id: selectedReview.creator_id,
      admin_message: adminReply,
    });

    setAdminReply("");
    setSelectedReview(null);
    loadData();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Administration MyWornSkin</h1>

        {/* Onglets */}
        <div className="flex border-b border-zinc-800 mb-10">
          <button onClick={() => setActiveTab('photos')} className={`px-8 py-4 font-medium flex items-center gap-3 transition-all ${activeTab === 'photos' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <ImageIcon size={22} /> Photos en attente
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`px-8 py-4 font-medium flex items-center gap-3 transition-all ${activeTab === 'reviews' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <AlertTriangle size={22} /> Commentaires refusés
          </button>
          <button onClick={() => setActiveTab('messages')} className={`px-8 py-4 font-medium flex items-center gap-3 transition-all ${activeTab === 'messages' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <MessageCircle size={22} /> Messages
          </button>
        </div>

        {/* ==================== PHOTOS ==================== */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pendingPhotos.length === 0 ? (
              <p className="text-zinc-500">Aucune photo en attente.</p>
            ) : (
              pendingPhotos.map(p => (
                <div key={p.id} className="bg-zinc-900 rounded-3xl p-8">
                  <h3 className="font-semibold text-xl mb-6">{p.username}</h3>
                  {p.avatar_pending_url && (
                    <div className="mb-10">
                      <p className="text-pink-400 mb-4">Photo de profil</p>
                      <img src={p.avatar_pending_url} className="w-48 h-48 rounded-2xl object-cover mb-6" />
                      <div className="flex gap-4">
                        <button onClick={() => handlePhotoAction(p.id, 'avatar', 'approved')} className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl">✅ Valider</button>
                        <button onClick={() => handlePhotoAction(p.id, 'avatar', 'rejected')} className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl">❌ Refuser</button>
                      </div>
                    </div>
                  )}
                  {p.banner_pending_url && (
                    <div>
                      <p className="text-pink-400 mb-4">Photo de couverture</p>
                      <img src={p.banner_pending_url} className="w-full h-64 object-cover rounded-2xl mb-6" />
                      <div className="flex gap-4">
                        <button onClick={() => handlePhotoAction(p.id, 'banner', 'approved')} className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl">✅ Valider</button>
                        <button onClick={() => handlePhotoAction(p.id, 'banner', 'rejected')} className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl">❌ Refuser</button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== COMMENTAIRES REFUSÉS ==================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {refusedReviews.length === 0 ? (
              <p className="text-zinc-500 text-lg">Aucun commentaire refusé pour le moment.</p>
            ) : (
              refusedReviews.map(review => {
                const refusalCount = creatorRefusalCounts[review.creator_id] || 0;
                return (
                  <div key={review.id} className="bg-zinc-900 rounded-3xl p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-3">
                          <Link href={`/creators/me`} className="font-semibold text-xl hover:text-pink-400">
                            Créatrice
                          </Link>
                          <span className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-sm">
                            {refusalCount} refus
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => forcePublishReview(review.id)}
                          className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-2xl text-sm font-medium"
                        >
                          Publier quand même
                        </button>
                        <button 
                          onClick={() => ignoreReview(review.id)}
                          className="bg-zinc-700 hover:bg-zinc-600 px-6 py-3 rounded-2xl text-sm font-medium flex items-center gap-2"
                        >
                          <Trash2 size={16} /> Ignorer
                        </button>
                      </div>
                    </div>

                    <p className="italic text-lg mb-4">"{review.comment}"</p>
                    <p className="text-sm text-zinc-500">- {review.reviewer_name}</p>

                    <button 
                      onClick={() => setSelectedReview(review)}
                      className="mt-6 text-pink-400 hover:text-pink-300 flex items-center gap-2 font-medium"
                    >
                      <MessageCircle size={20} /> Envoyer un message à la créatrice
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ==================== MESSAGES (à compléter après) ==================== */}
        {activeTab === 'messages' && (
          <div className="text-zinc-500">
            Page Messages Admin (sera développée juste après)
          </div>
        )}

        {/* Modal Message */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="bg-zinc-900 rounded-3xl p-8 w-full max-w-lg">
              <h3 className="text-xl mb-6">Message à la créatrice</h3>
              <textarea
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                className="w-full h-40 bg-zinc-800 rounded-2xl p-4 mb-6"
                placeholder="Pourquoi as-tu refusé ce commentaire ?"
              />
              <div className="flex gap-4">
                <button onClick={() => setSelectedReview(null)} className="flex-1 py-4 border border-zinc-700 rounded-2xl">Annuler</button>
                <button onClick={sendAdminMessage} className="flex-1 bg-pink-600 hover:bg-pink-500 py-4 rounded-2xl flex items-center justify-center gap-2">
                  <Send size={18} /> Envoyer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
