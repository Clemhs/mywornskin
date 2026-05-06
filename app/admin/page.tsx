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
  const [reports, setReports] = useState<any[]>([]);

  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [adminReply, setAdminReply] = useState("");

  const loadData = async () => {
    if (activeTab === 'photos') {
      const { data } = await supabase
        .from('profiles')
        .select(`id, username, full_name, avatar_url, banner_url, avatar_pending_url, banner_pending_url, avatar_status, banner_status`)
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
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          creator:profiles!creator_id (username, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erreur chargement reports :", error);
      } else {
        console.log(`✅ ${data?.length || 0} signalements chargés`, data);
        setReports(data || []);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Auto-refresh signalements
  useEffect(() => {
    if (activeTab !== 'reports') return;
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // ... Tes autres fonctions (handlePhotoAction, forcePublishReview, etc.) restent inchangées ...

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

        {/* SIGNALEMENTS */}
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
                      <p className="text-sm text-zinc-500 mt-1">
                        Le {new Date(report.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <span className="px-4 py-1 bg-red-500/10 text-red-400 rounded-full text-sm">
                      {report.status}
                    </span>
                  </div>
                  <p className="mt-6 italic text-zinc-300">"{report.reason}"</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tes autres onglets restent identiques (photos, reviews, messages) */}

      </div>
    </div>
  );
}
