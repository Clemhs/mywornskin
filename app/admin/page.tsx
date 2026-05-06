'use client';

import { useState, useEffect, useMemo } from 'react';
import { MessageCircle, AlertTriangle, Image as ImageIcon, Send, Trash2, Flag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'photos' | 'reviews' | 'messages' | 'reports'>('photos');

  const [pendingPhotos, setPendingPhotos] = useState<any[]>([]);
  const [refusedReviews, setRefusedReviews] = useState<any[]>([]);
  const [adminMessages, setAdminMessages] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);   // ← Nouveau

  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [adminReply, setAdminReply] = useState("");

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

    if (activeTab === 'reports') {
      const { data } = await supabase
        .from('reports')
        .select(`
          *,
          creator:profiles!creator_id (username, full_name),
          reporter:profiles!reporter_id (username)
        `)
        .order('created_at', { ascending: false });
      setReports(data || []);
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
    // ... ton code existant (inchangé) ...
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

        <div className="flex border-b border-zinc-800 mb-10 overflow-x-auto">
          <button onClick={() => setActiveTab('photos')} className={`px-8 py-4 font-medium flex items-center gap-3 whitespace-nowrap ${activeTab === 'photos' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <ImageIcon size={22} /> Photos en attente
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`px-8 py-4 font-medium flex items-center gap-3 whitespace-nowrap ${activeTab === 'reviews' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <AlertTriangle size={22} /> Commentaires refusés
          </button>
          <button onClick={() => setActiveTab('messages')} className={`px-8 py-4 font-medium flex items-center gap-3 whitespace-nowrap ${activeTab === 'messages' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <MessageCircle size={22} /> Messages
          </button>
          <button onClick={() => setActiveTab('reports')} className={`px-8 py-4 font-medium flex items-center gap-3 whitespace-nowrap ${activeTab === 'reports' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <Flag size={22} /> Signalements
          </button>
        </div>

        {/* PHOTOS - inchangé */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pendingPhotos.length === 0 ? (
              <p className="text-zinc-500 text-xl">Aucune photo en attente de validation.</p>
            ) : (
              pendingPhotos.map((p) => (
                <div key={p.id} className="bg-zinc-900 rounded-3xl p-8">
                  {/* ... ton code existant pour les photos ... */}
                </div>
              ))
            )}
          </div>
        )}

        {/* COMMENTAIRES REFUSÉS - inchangé */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* ... ton code existant pour les reviews ... */}
          </div>
        )}

        {/* MESSAGES - inchangé */}
        {activeTab === 'messages' && (
          <div className="text-zinc-400">Section Messages Admin (en cours)</div>
        )}

        {/* NOUVEL ONGLET : SIGNALEMENTS */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {reports.length === 0 ? (
              <p className="text-zinc-500 text-xl">Aucun signalement pour le moment.</p>
            ) : (
              reports.map(report => (
                <div key={report.id} className="bg-zinc-900 rounded-3xl p-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-semibold">
                        Signalement contre <Link href={`/creators/${report.creator?.username}`} className="text-pink-400 hover:underline">@{report.creator?.username}</Link>
                      </p>
                      <p className="text-sm text-zinc-500 mt-1">Par {report.reporter?.username || 'Utilisateur anonyme'}</p>
                    </div>
                    <span className="px-4 py-1.5 bg-red-500/10 text-red-400 text-sm rounded-full">
                      {report.status}
                    </span>
                  </div>

                  <p className="mt-6 text-zinc-300 italic">"{report.reason}"</p>

                  <div className="mt-6 flex gap-4">
                    <button className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-2xl text-sm">Marquer comme traité</button>
                    <button className="bg-zinc-700 hover:bg-zinc-600 px-6 py-3 rounded-2xl text-sm">Ignorer</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
