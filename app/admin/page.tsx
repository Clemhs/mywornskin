'use client';

import { useState, useEffect } from 'react';
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
  };

  const forcePublishReview = async (reviewId: string) => {
    await supabase.from('reviews').update({ status: 'approved' }).eq('id', reviewId);
    loadData();
  };

  const ignoreReview = async (reviewId: string) => {
    await supabase.from('reviews').update({ status: 'ignored' }).eq('id', reviewId);
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

        <div className="flex border-b border-zinc-800 mb-10">
          <button onClick={() => setActiveTab('photos')} className={`px-8 py-4 font-medium flex items-center gap-3 ${activeTab === 'photos' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400'}`}>
            <ImageIcon size={22} /> Photos en attente
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`px-8 py-4 font-medium flex items-center gap-3 ${activeTab === 'reviews' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400'}`}>
            <AlertTriangle size={22} /> Commentaires refusés
          </button>
          <button onClick={() => setActiveTab('messages')} className={`px-8 py-4 font-medium flex items-center gap-3 ${activeTab === 'messages' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400'}`}>
            <MessageCircle size={22} /> Messages Admin
          </button>
        </div>

        {/* PHOTOS */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pendingPhotos.length === 0 ? <p className="text-zinc-500">Aucune photo en attente.</p> : (
              pendingPhotos.map(p => (
                <div key={p.id} className="bg-zinc-900 rounded-3xl p-8">
                  <h3 className="font-semibold text-xl mb-6">@{p.username}</h3>
                  {p.avatar_pending_url && (
                    <div className="mb-12">
                      <p className="text-pink-400 mb-4">Photo de profil</p>
                      <img src={p.avatar_pending_url} className="w-48 h-48 rounded-2xl object-cover mb-6" />
                      <div className="flex gap-4">
                        <button onClick={() => handlePhotoAction(p.id, 'avatar', 'approved')} className="flex-1 bg-green-600 py-4 rounded-2xl">✅ Valider</button>
                        <button onClick={() => handlePhotoAction(p.id, 'avatar', 'rejected')} className="flex-1 bg-red-600 py-4 rounded-2xl">❌ Refuser</button>
                      </div>
                    </div>
                  )}
                  {p.banner_pending_url && (
                    <div>
                      <p className="text-pink-400 mb-4">Photo de couverture</p>
                      <img src={p.banner_pending_url} className="w-full h-64 object-cover rounded-2xl mb-6" />
                      <div className="flex gap-4">
                        <button onClick={() => handlePhotoAction(p.id, 'banner', 'approved')} className="flex-1 bg-green-600 py-4 rounded-2xl">✅ Valider</button>
                        <button onClick={() => handlePhotoAction(p.id, 'banner', 'rejected')} className="flex-1 bg-red-600 py-4 rounded-2xl">❌ Refuser</button>
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
            {refusedReviews.length === 0 ? <p>Aucun commentaire refusé.</p> : (
              refusedReviews.map(review => (
                <div key={review.id} className="bg-zinc-900 rounded-3xl p-8">
                  <p className="italic text-lg">"{review.comment}"</p>
                  <div className="flex justify-end gap-4 mt-6">
                    <button onClick={() => forcePublishReview(review.id)} className="bg-green-600 px-6 py-3 rounded-2xl">Publier quand même</button>
                    <button onClick={() => ignoreReview(review.id)} className="bg-zinc-700 px-6 py-3 rounded-2xl">Ignorer</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === 'messages' && (
          <div className="text-zinc-400">Section Messages Admin (à développer)</div>
        )}
      </div>
    </div>
  );
}
