'use client';

import { useState, useEffect, useMemo } from 'react';
import { MessageCircle, AlertTriangle, Image as ImageIcon, Send, Trash2, X, CheckCircle } from 'lucide-react';
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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    if (activeTab === 'photos') {
      const { data } = await supabase
        .from('profiles')
        .select(`
          id, 
          username, 
          full_name,
          avatar_url,
          banner_url,
          avatar_pending_url,
          banner_pending_url,
          avatar_status,
          banner_status
        `)
        .or('avatar_status.eq.pending,banner_status.eq.pending')
        .order('updated_at', { ascending: false });

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

  const creatorRefusalCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    refusedReviews.forEach(r => {
      counts[r.creator_id] = (counts[r.creator_id] || 0) + 1;
    });
    return counts;
  }, [refusedReviews]);

  const handlePhotoAction = async (profileId: string, type: 'avatar' | 'banner', action: 'approved' | 'rejected') => {
    const pendingField = type === 'avatar' ? 'avatar_pending_url' : 'banner_pending_url';
    const mainField = type === 'avatar' ? 'avatar_url' : 'banner_url';
    const statusField = type === 'avatar' ? 'avatar_status' : 'banner_status';

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', profileId).single();

    if (action === 'approved' && profile?.[pendingField]) {
      await supabase.from('profiles').update({
        [mainField]: profile[pendingField],
        [pendingField]: null,
        [statusField]: 'approved'
      }).eq('id', profileId);
    } else {
      await supabase.from('profiles').update({
        [pendingField]: null,
        [statusField]: 'rejected'
      }).eq('id', profileId);
    }
    loadData();
    showToast(action === 'approved' ? "✅ Photo validée" : "❌ Photo refusée");
  };

  const forcePublishReview = async (reviewId: string) => {
    await supabase.from('reviews').update({ status: 'approved' }).eq('id', reviewId);
    loadData();
    showToast("✅ Commentaire publié");
  };

  const ignoreReview = async (reviewId: string) => {
    await supabase.from('reviews').update({ status: 'ignored' }).eq('id', reviewId);
    loadData();
    showToast("Commentaire ignoré");
  };

  const sendAdminMessage = async () => {
    if (!selectedReview || !adminReply.trim()) {
      showToast("Veuillez écrire un message", "error");
      return;
    }

    const { error } = await supabase.from('admin_messages').insert({
      review_id: selectedReview.id,
      creator_id: selectedReview.creator_id,
      admin_message: adminReply,
    });

    if (error) {
      console.error(error);
      showToast("Erreur lors de l'envoi du message", "error");
    } else {
      showToast("✅ Message envoyé à la créatrice");
      setAdminReply("");
      setSelectedReview(null);
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Administration MyWornSkin</h1>

        <div className="flex border-b border-zinc-800 mb-10">
          <button onClick={() => setActiveTab('photos')} className={`px-8 py-4 font-medium flex items-center gap-3 ${activeTab === 'photos' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <ImageIcon size={22} /> Photos en attente
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`px-8 py-4 font-medium flex items-center gap-3 ${activeTab === 'reviews' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <AlertTriangle size={22} /> Commentaires refusés
          </button>
          <button onClick={() => setActiveTab('messages')} className={`px-8 py-4 font-medium flex items-center gap-3 ${activeTab === 'messages' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <MessageCircle size={22} /> Messages
          </button>
        </div>

        {/* PHOTOS */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pendingPhotos.length === 0 ? (
              <p className="text-zinc-500 text-xl">Aucune photo en attente de validation.</p>
            ) : (
              pendingPhotos.map((p) => (
                <div key={p.id} className="bg-zinc-900 rounded-3xl p-8">
                  <h3 className="font-semibold text-xl mb-6">@{p.username}</h3>

                  {p.avatar_pending_url && (
                    <div className="mb-12">
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

        {/* COMMENTAIRES REFUSÉS */}
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
                        <Link href={`/creators/${review.creator_id}`} className="font-semibold text-xl hover:text-pink-400">
                          Créatrice
                        </Link>
                        <span className="ml-3 bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-sm">
                          {refusalCount} refus
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => forcePublishReview(review.id)} className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-2xl text-sm font-medium">
                          Publier quand même
                        </button>
                        <button onClick={() => ignoreReview(review.id)} className="bg-zinc-700 hover:bg-zinc-600 px-6 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
                          <Trash2 size={16} /> Ignorer
                        </button>
                      </div>
                    </div>
                    <p className="italic text-lg mb-4">"{review.comment}"</p>
                    <p className="text-sm text-zinc-500">- {review.reviewer_name || 'Client anonyme'}</p>
                    
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

        {/* MESSAGES */}
        {activeTab === 'messages' && (
          <div className="text-zinc-400">Section Messages Admin (en cours)</div>
        )}
      </div>

      {/* MODAL ENVOYER MESSAGE */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-3xl w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Envoyer un message</h3>
              <button onClick={() => { setSelectedReview(null); setAdminReply(""); }} className="text-zinc-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <p className="text-zinc-400 mb-2">Commentaire concerné :</p>
            <p className="italic mb-6">"{selectedReview.comment}"</p>

            <textarea
              value={adminReply}
              onChange={(e) => setAdminReply(e.target.value)}
              placeholder="Écris ton message ici..."
              className="w-full h-32 bg-zinc-950 border border-zinc-700 rounded-2xl p-4 focus:outline-none focus:border-pink-500"
            />

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => { setSelectedReview(null); setAdminReply(""); }}
                className="flex-1 py-4 rounded-2xl border border-zinc-700 hover:bg-zinc-800"
              >
                Annuler
              </button>
              <button 
                onClick={sendAdminMessage}
                disabled={!adminReply.trim()}
                className="flex-1 py-4 rounded-2xl bg-pink-600 hover:bg-pink-500 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
              >
                <Send size={18} /> Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' && <CheckCircle size={22} />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
