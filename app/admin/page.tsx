'use client';

import { useState, useEffect, useMemo } from 'react';
import { MessageCircle, AlertTriangle, Image as ImageIcon, Send, Trash2, Flag, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminPage() {
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'photos' | 'reviews' | 'messages' | 'reports'>('photos');
  const [reportFilter, setReportFilter] = useState<'pending' | 'reviewed' | 'dismissed' | 'all'>('pending');
  const [refreshKey, setRefreshKey] = useState(0);

  const [pendingPhotos, setPendingPhotos] = useState<any[]>([]);
  const [refusedReviews, setRefusedReviews] = useState<any[]>([]);
  const [adminMessages, setAdminMessages] = useState<any[]>([]);
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
  }, [activeTab, refreshKey]);

  const filteredReports = useMemo(() => {
    return reportFilter === 'all' ? reports : reports.filter(r => r.status === reportFilter);
  }, [reports, reportFilter]);

  const reportsByCreator = useMemo(() => {
    const grouped: any = {};
    filteredReports.forEach((report) => {
      const key = report.creator_id;
      if (!grouped[key]) {
        grouped[key] = { creator: report.creator, count: 0, reports: [] };
      }
      grouped[key].count++;
      grouped[key].reports.push(report);
    });
    return Object.values(grouped).sort((a: any, b: any) => b.count - a.count);
  }, [filteredReports]);

  // ACTIONS SIGNALEMENTS
  const markReportAsReviewed = async (reportId: string) => {
    const { error } = await supabase.from('reports').update({ status: 'reviewed' }).eq('id', reportId);
    if (error) showToast("Erreur lors de la mise à jour", "error");
    else {
      showToast("✅ Signalement marqué comme traité");
      setRefreshKey(prev => prev + 1);
    }
  };

  const dismissReport = async (reportId: string) => {
    const { error } = await supabase.from('reports').update({ status: 'dismissed' }).eq('id', reportId);
    if (error) showToast("Erreur lors de la mise à jour", "error");
    else {
      showToast("Signalement ignoré");
      setRefreshKey(prev => prev + 1);
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm("Supprimer définitivement ce signalement ?")) return;
    const { error } = await supabase.from('reports').delete().eq('id', reportId);
    if (error) showToast("Erreur lors de la suppression", "error");
    else {
      showToast("Signalement supprimé");
      setRefreshKey(prev => prev + 1);
    }
  };

  // FONCTIONS ORIGINALES (Photos + Commentaires)
  const handlePhotoAction = async (profileId: string, type: 'avatar' | 'banner', action: 'approved' | 'rejected') => { /* ... ton code original ... */ };
  const forcePublishReview = async (reviewId: string) => { /* ... */ };
  const ignoreReview = async (reviewId: string) => { /* ... */ };
  const sendAdminMessage = async () => { /* ... */ };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      {/* ... tout le JSX que tu avais avant ... */}
      {/* (Je te mets la partie signalements complète ci-dessous pour gagner de la place, mais tu dois garder tout le reste) */}

      {activeTab === 'reports' && (
        <div key={refreshKey}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Signalements ({reports.length})</h2>
            <div className="flex gap-3">
              <select value={reportFilter} onChange={(e) => setReportFilter(e.target.value as any)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-2 text-sm">
                <option value="pending">En attente</option>
                <option value="reviewed">Traités</option>
                <option value="dismissed">Ignorés</option>
                <option value="all">Tous</option>
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

                        <div className="mt-6 flex gap-3">
                          <button onClick={() => markReportAsReviewed(report.id)} className="bg-green-600 hover:bg-green-500 px-5 py-2.5 rounded-2xl text-sm flex items-center gap-2">
                            <CheckCircle size={16} /> Marquer comme traité
                          </button>
                          <button onClick={() => dismissReport(report.id)} className="bg-zinc-700 hover:bg-zinc-600 px-5 py-2.5 rounded-2xl text-sm">
                            Ignorer
                          </button>
                          <button onClick={() => deleteReport(report.id)} className="bg-red-600/80 hover:bg-red-600 px-5 py-2.5 rounded-2xl text-sm flex items-center gap-2">
                            <Trash2 size={16} /> Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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
  );
}
