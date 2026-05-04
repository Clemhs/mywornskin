'use client';

import { useState, useEffect } from 'react';
import { Check, X, MessageCircle, Image, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'photos' | 'reviews' | 'messages'>('photos');

  const [pendingPhotos, setPendingPhotos] = useState<any[]>([]);
  const [refusedReviews, setRefusedReviews] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const loadPhotos = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, avatar_pending_url, banner_pending_url, avatar_status, banner_status, email')
      .or('avatar_status.eq.pending,banner_status.eq.pending')
      .order('updated_at', { ascending: false });

    setPendingPhotos(data || []);
  };

  const loadRefusedReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles!inner(username)')
      .eq('status', 'rejected_by_creator')
      .order('created_at', { ascending: false });

    setRefusedReviews(data || []);
  };

  const loadMessages = async () => {
    const { data } = await supabase
      .from('admin_messages')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false });

    setMessages(data || []);
  };

  useEffect(() => {
    if (activeTab === 'photos') loadPhotos();
    if (activeTab === 'reviews') loadRefusedReviews();
    if (activeTab === 'messages') loadMessages();
  }, [activeTab]);

  const handlePhotoAction = async (profileId: string, type: 'avatar' | 'banner', action: 'approved' | 'rejected') => {
    const field = type === 'avatar' ? 'avatar_status' : 'banner_status';
    const pendingField = type === 'avatar' ? 'avatar_pending_url' : 'banner_pending_url';

    await supabase
      .from('profiles')
      .update({ 
        [field]: action,
        [pendingField]: null 
      })
      .eq('id', profileId);

    loadPhotos();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Administration MyWornSkin</h1>

        {/* Onglets */}
        <div className="flex border-b border-zinc-800 mb-10">
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-8 py-4 font-medium transition-all flex items-center gap-2 ${activeTab === 'photos' ? 'border-b-2 border-pink-500 text-pink-400' : 'text-zinc-400 hover:text-white'}`}
          >
            <Image size={20} /> Photos en attente
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-8 py-4 font-medium transition-all flex items-center gap-2 ${activeTab === 'reviews' ? 'border-b-2 border-pink-500 text-pink-400' : 'text-zinc-400 hover:text-white'}`}
          >
            <AlertTriangle size={20} /> Commentaires refusés
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-8 py-4 font-medium transition-all flex items-center gap-2 ${activeTab === 'messages' ? 'border-b-2 border-pink-500 text-pink-400' : 'text-zinc-400 hover:text-white'}`}
          >
            <MessageCircle size={20} /> Messages & Modération
          </button>
        </div>

        {/* ==================== ONGLET PHOTOS ==================== */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pendingPhotos.length === 0 ? (
              <p className="text-zinc-500">Aucune photo en attente de validation.</p>
            ) : (
              pendingPhotos.map((p) => (
                <div key={p.id} className="bg-zinc-900 rounded-3xl p-6 border border-zinc-700">
                  <p className="font-semibold text-lg mb-4">{p.username}</p>

                  {p.avatar_pending_url && (
                    <div className="mb-10">
                      <p className="text-pink-400 mb-3">📸 Photo de profil</p>
                      <img src={p.avatar_pending_url} className="w-40 h-40 rounded-2xl object-cover mb-4" />
                      <div className="flex gap-4">
                        <button onClick={() => handlePhotoAction(p.id, 'avatar', 'approved')} className="flex-1 bg-green-600 hover:bg-green-500 py-3 rounded-2xl">✅ Valider</button>
                        <button onClick={() => handlePhotoAction(p.id, 'avatar', 'rejected')} className="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-2xl">❌ Refuser</button>
                      </div>
                    </div>
                  )}

                  {p.banner_pending_url && (
                    <div>
                      <p className="text-pink-400 mb-3">🖼️ Photo de couverture</p>
                      <img src={p.banner_pending_url} className="w-full h-48 object-cover rounded-2xl mb-4" />
                      <div className="flex gap-4">
                        <button onClick={() => handlePhotoAction(p.id, 'banner', 'approved')} className="flex-1 bg-green-600 hover:bg-green-500 py-3 rounded-2xl">✅ Valider</button>
                        <button onClick={() => handlePhotoAction(p.id, 'banner', 'rejected')} className="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-2xl">❌ Refuser</button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== ONGLET COMMENTAIRES REFUSÉS ==================== */}
        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-2xl mb-6">Commentaires refusés par les créatrices</h2>
            {refusedReviews.length === 0 ? (
              <p className="text-zinc-500">Aucun commentaire refusé pour le moment.</p>
            ) : (
              refusedReviews.map((review) => (
                <div key={review.id} className="bg-zinc-900 rounded-2xl p-6 mb-6">
                  <p className="font-medium">{review.profiles?.username}</p>
                  <p className="italic mt-2">"{review.comment}"</p>
                  <div className="mt-4 flex gap-4">
                    <button className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-xl">Forcer la publication</button>
                    <button className="bg-zinc-700 hover:bg-zinc-600 px-6 py-2 rounded-xl">Envoyer un message à la créatrice</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== ONGLET MESSAGES ==================== */}
        {activeTab === 'messages' && (
          <div>
            <h2 className="text-2xl mb-6">Messages de modération</h2>
            <p className="text-zinc-500">Fonctionnalité en cours de développement...</p>
          </div>
        )}
      </div>
    </div>
  );
}
