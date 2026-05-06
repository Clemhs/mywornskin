'use client';

import { useState, useEffect, useMemo } from 'react';
import { MessageCircle, AlertTriangle, Image as ImageIcon, Send, Trash2, Flag, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'photos' | 'reviews' | 'messages' | 'reports'>('photos');
  const [reportFilter, setReportFilter] = useState<'all' | 'pending' | 'reviewed' | 'dismissed'>('all');

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

      if (error) console.error("Erreur reports :", error);
      else setReports(data || []);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Auto-refresh sur les signalements
  useEffect(() => {
    if (activeTab !== 'reports') return;
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Filtrage des signalements
  const filteredReports = useMemo(() => {
    let filtered = reports;
    if (reportFilter !== 'all') {
      filtered = filtered.filter(r => r.status === reportFilter);
    }
    return filtered;
  }, [reports, reportFilter]);

  // Regroupement par créatrice
  const reportsByCreator = useMemo(() => {
    const grouped: any = {};
    filteredReports.forEach(report => {
      const key = report.creator_id;
      if (!grouped[key]) {
        grouped[key] = {
          creator: report.creator,
          count: 0,
          reports: []
        };
      }
      grouped[key].count++;
      grouped[key].reports.push(report);
    });
    return Object.values(grouped).sort((a: any, b: any) => b.count - a.count);
  }, [filteredReports]);

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
          <button onClick={() => setActiveTab('reports')} className={`px-8 py-4 font-medium flex items-center gap-3 whitespace-nowrap relative ${activeTab === 'reports' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <Flag size={22} /> Signalements
            {reports.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {reports.length}
              </span>
            )}
          </button>
        </div>

        {/* === SIGNALEMENTS - VERSION COMPLÈTE === */}
        {activeTab === 'reports' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Signalements ({reports.length})</h2>
              <div className="flex gap-3">
                <select 
                  value={reportFilter} 
                  onChange={(e) => setReportFilter(e.target.value as any)}
                  className="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-2 text-sm"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="reviewed">Traités</option>
                  <option value="dismissed">Ignorés</option>
                </select>
                <button onClick={loadData} className="text-sm text-zinc-400 hover:text-white">↻ Actualiser</button>
              </div>
            </div>

            {reports.length === 0 ? (
              <p className="text-zinc-500 text-xl">Aucun signalement pour le moment.</p>
            ) : (
              <div className="space-y-8">
                {reportsByCreator.map((group: any) => (
                  <div key={group.creator.id} className="bg-zinc-900 rounded-3xl p-8">
                    <div className="flex justify-between mb-6">
                      <div>
                        <Link href={`/creators/${group.creator.username}`} className="text-xl font-semibold hover:text-pink-400">
                          @{group.creator.username}
                        </Link>
                        <span className="ml-3 bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-sm">
                          {group.count} signalement{group.count > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {group.reports.map((report: any) => (
                        <div key={report.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                          <p className="italic text-zinc-300">"{report.reason}"</p>
                          <p className="text-xs text-zinc-500 mt-3">
                            {new Date(report.created_at).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tes autres onglets restent inchangés (photos, reviews, messages) */}
        {/* ... */}

      </div>
    </div>
  );
}
