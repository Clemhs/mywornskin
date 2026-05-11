'use client';

import { useState, useEffect, useMemo } from 'react';
import { MessageCircle, AlertTriangle, Image as ImageIcon, Send, Trash2, Flag, CheckCircle, Search, SortAsc, SortDesc } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminPage() {
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'photos' | 'reviews' | 'messages' | 'reports'>('photos');
  const [reportFilter, setReportFilter] = useState<'pending' | 'reviewed' | 'dismissed' | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most'>('newest');

  const [pendingPhotos, setPendingPhotos] = useState<any[]>([]);
  const [refusedReviews, setRefusedReviews] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [adminReply, setAdminReply] = useState("");

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };

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

    if (activeTab === 'reports') {
      const { data } = await supabase
        .from('reports')
        .select(`*, creator:profiles!creator_id (username, full_name)`)
        .order('created_at', { ascending: false });
      setReports(data || []);
    }

    const { count } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    setPendingReportsCount(count || 0);
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Recherche + Tri + Filtre
  const filteredAndSortedReports = useMemo(() => {
    let result = [...reports];

    // Recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(report => 
        report.reason.toLowerCase().includes(term) ||
        (report.creator?.username && report.creator.username.toLowerCase().includes(term))
      );
    }

    // Filtre par statut
    if (reportFilter !== 'all') {
      result = result.filter(r => r.status === reportFilter);
    }

    // Tri
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === 'most') {
      // Tri par nombre de signalements par créatrice (plus complexe)
      const countMap = {};
      result.forEach(r => {
        countMap[r.creator_id] = (countMap[r.creator_id] || 0) + 1;
      });
      result.sort((a, b) => (countMap[b.creator_id] || 0) - (countMap[a.creator_id] || 0));
    }

    return result;
  }, [reports, searchTerm, reportFilter, sortBy]);

  const reportsByCreator = useMemo(() => {
    const grouped: any = {};
    filteredAndSortedReports.forEach(report => {
      const key = report.creator_id;
      if (!grouped[key]) {
        grouped[key] = { creator: report.creator, count: 0, reports: [] };
      }
      grouped[key].count++;
      grouped[key].reports.push(report);
    });
    return Object.values(grouped).sort((a: any, b: any) => b.count - a.count);
  }, [filteredAndSortedReports]);

  // Actions
  const markReportAsReviewed = async (reportId: string) => {
    const { error } = await supabase.from('reports').update({ status: 'reviewed' }).eq('id', reportId);
    if (error) showToast("Erreur", "error");
    else showToast("✅ Signalement marqué comme traité");
    setRefreshKey(k => k + 1); // on garde un refreshKey même si pas utilisé partout
  };

  const dismissReport = async (reportId: string) => {
    await supabase.from('reports').update({ status: 'dismissed' }).eq('id', reportId);
    showToast("Signalement ignoré");
    setRefreshKey(k => k + 1);
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm("Supprimer définitivement ?")) return;
    await supabase.from('reports').delete().eq('id', reportId);
    showToast("Signalement supprimé");
    setRefreshKey(k => k + 1);
  };

  // === FONCTIONS PHOTOS & COMMENTAIRES (inchangées) ===
  const handlePhotoAction = async (profileId: string, type: 'avatar' | 'banner', action: 'approved' | 'rejected') => { /* ... ton code original */ };
  const forcePublishReview = async (reviewId: string) => { /* ... */ };
  const ignoreReview = async (reviewId: string) => { /* ... */ };
  const sendAdminMessage = async () => { /* ... */ };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Administration MyWornSkin</h1>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 mb-10 overflow-x-auto">
          {/* Tes 4 tabs (photos, commentaires, messages, signalements) */}
        </div>

        {/* SIGNALEMENTS - VERSION AMÉLIORÉE */}
        {activeTab === 'reports' && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3.5 text-zinc-500" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher une raison ou une créatrice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 pl-11 py-3 rounded-2xl text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 text-sm"
              >
                <option value="newest">Plus récents</option>
                <option value="oldest">Plus anciens</option>
                <option value="most">Plus de signalements</option>
              </select>

              <select value={reportFilter} onChange={(e) => setReportFilter(e.target.value as any)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 text-sm">
                <option value="pending">En attente</option>
                <option value="reviewed">Traités</option>
                <option value="dismissed">Ignorés</option>
                <option value="all">Tous</option>
              </select>
            </div>

            {/* Liste */}
            {reports.length === 0 ? (
              <p className="text-zinc-500 text-xl">Aucun signalement.</p>
            ) : (
              <div className="space-y-8">
                {reportsByCreator.map((group: any) => (
                  <div key={group.creator.id} className="bg-zinc-900 rounded-3xl p-8">
                    {/* ... reste identique ... */}
                  </div>
                ))}
              </div>
            )}
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
    </div>
  );
}
