'use client';

import { useState, useEffect } from 'react';
import { Check, X, MessageCircle, Image as ImageIcon, AlertTriangle, Send } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'photos' | 'reviews' | 'messages'>('photos');

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
        .or('avatar_status.eq.pending,banner_status.eq.pending')
        .order('updated_at', { ascending: false });
      setPendingPhotos(data || []);
    }

    if (activeTab === 'reviews') {
      const { data } = await supabase
        .from('reviews')
        .select('*, profiles(username)')
        .eq('status', 'rejected_by_creator')
        .order('created_at', { ascending: false });
      setRefusedReviews(data || []);
    }

    if (activeTab === 'messages') {
      const { data } = await supabase
        .from('admin_messages')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false });
      setAdminMessages(data || []);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Actions Photos
  const handlePhotoAction = async (profileId: string, type: 'avatar' | 'banner', action: 'approved' | 'rejected') => {
    const statusField = type === 'avatar' ? 'avatar_status' : 'banner_status';
    const pendingField = type === 'avatar' ? 'avatar_pending_url' : 'banner_pending_url';

    await supabase
      .from('profiles')
      .update({ 
        [statusField]: action,
        [pendingField]: null 
      })
      .eq('id', profileId);

    loadData();
  };

  // Forcer la publication d'un commentaire refusé
  const forcePublishReview = async (reviewId: string) => {
    await supabase.from('reviews').update({ status: 'approved' }).eq('id', reviewId);
    loadData();
  };

  // Envoyer un message à la créatrice
  const sendAdminMessage = async (reviewId: string, creatorId: string) => {
    if (!adminReply.trim()) return;

    await supabase.from('admin_messages').insert({
      review_id: reviewId,
      creator_id: creatorId,
      admin_message: adminReply,
    });

    setAdminReply("");
    setSelectedReview(null);
    loadData();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Administration MyWornSkin</h1>

        {/* Onglets */}
        <div className="flex border-b border-zinc-800 mb-10 text-lg">
          <button onClick={() => setActiveTab('photos')} className={`px-10 py-4 font-medium transition-all flex items-center gap-3 ${activeTab === 'photos' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <ImageIcon /> Photos en attente
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`px-10 py-4 font-medium transition-all flex items-center gap-3 ${activeTab === 'reviews' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <AlertTriangle /> Commentaires refusés
          </button>
          <button onClick={() => setActiveTab('messages')} className={`px-10 py-4 font-medium transition-all flex items-center gap-3 ${activeTab === 'messages' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <MessageCircle /> Messages Admin
          </button>
        </div>

        {/* ==================== PHOTOS EN ATTENTE ==================== */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pendingPhotos.length === 0 ? (
              <p className="text-zinc-500 text-lg">Aucune photo en attente de validation.</p>
            ) : (
              pendingPhotos.map((p) => (
                <div key={p.id} className="bg-zinc-900 rounded-3xl p-8">
                  <h3 className="font-semibold text-xl mb-6">{p.username}</h3>

                  {p.avatar_pending_url && (
                    <div className="mb-12">
                      <p className="text-pink-400 mb-4">Photo de profil</p>
                      <img src={p.avatar_pending_url} className="w-48 h-48 rounded-2xl object-cover mb-6" />
                      <div className="flex gap-4">
                        <button onClick={() => handlePhotoAction(p.id, 'avatar', 'approved')} className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-medium">✅ Valider</button>
                        <button onClick={() => handlePhotoAction(p.id, 'avatar', 'rejected')} className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-medium">❌ Refuser</button>
                      </div>
                    </div>
                  )}

                  {p.banner_pending_url && (
                    <div>
                      <p className="text-pink-400 mb-4">Photo de couverture</p>
                      <img src={p.banner_pending_url} className="w-full h-64 object-cover rounded-2xl mb-6" />
                      <div className="flex gap-4">
                        <button onClick={() => handlePhotoAction(p.id, 'banner', 'approved')} className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-medium">✅ Valider</button>
                        <button onClick={() => handlePhotoAction(p.id, 'banner', 'rejected')} className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-medium">❌ Refuser</button>
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
              refusedReviews.map((review) => (
                <div key={review.id} className="bg-zinc-900 rounded-3xl p-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-lg">{review.profiles?.username}</p>
                      <p className="text-sm text-zinc-500 mt-1">Commentaire refusé par la créatrice</p>
                    </div>
                    <button 
                      onClick={() => forcePublishReview(review.id)}
                      className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-2xl text-sm"
                    >
                      Forcer la publication
                    </button>
                  </div>

                  <p className="italic text-lg mt-6">"{review.comment}"</p>

                  <button 
                    onClick={() => setSelectedReview(review)}
                    className="mt-6 flex items-center gap-2 text-pink-400 hover:text-pink-300"
                  >
                    <MessageCircle /> Envoyer un message à la créatrice
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Message modal */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-zinc-900 rounded-3xl p-8 w-full max-w-lg">
              <h3 className="text-xl mb-6">Message à {selectedReview.profiles?.username}</h3>
              <textarea 
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                className="w-full h-40 bg-zinc-800 rounded-2xl p-4 text-white"
                placeholder="Pourquoi as-tu refusé ce commentaire ?"
              />
              <div className="flex gap-4 mt-6">
                <button onClick={() => setSelectedReview(null)} className="flex-1 py-3 rounded-2xl border border-zinc-700">Annuler</button>
                <button onClick={() => sendAdminMessage(selectedReview.id, selectedReview.creator_id)} className="flex-1 bg-pink-600 hover:bg-pink-500 py-3 rounded-2xl">Envoyer le message</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
