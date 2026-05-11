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
  const [reports, setReports] = useState<any[]>([]);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };

  const loadData = async () => {
    if (activeTab === 'reports') {
      const { data, error } = await supabase
        .from('reports')
        .select(`*, creator:profiles!creator_id (username, full_name)`)
        .order('created_at', { ascending: false });

      if (error) console.error('❌ Erreur load reports:', error);
      console.log('📥 Reports chargés:', data?.length, data);
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

  const reportsByCreator = useMemo(() => {
    const grouped: any = {};
    reports.forEach(report => {
      const key = report.creator_id;
      if (!grouped[key]) grouped[key] = { creator: report.creator, count: 0, reports: [] };
      grouped[key].count++;
      grouped[key].reports.push(report);
    });
    return Object.values(grouped).sort((a: any, b: any) => b.count - a.count);
  }, [reports]);

  const markReportAsReviewed = async (reportId: string) => {
    console.log('🟢 markReportAsReviewed - ID:', reportId);

    setReports(prev => prev.filter(r => r.id !== reportId)); // optimiste

    const { data, error } = await supabase
      .from('reports')
      .update({ status: 'reviewed' })
      .eq('id', reportId)
      .select()
      .single();

    console.log('📤 Résultat update:', { data, error });

    if (error) {
      console.error('❌ Erreur Supabase complète:', error);
      showToast("Erreur : " + error.message, "error");
      setRefreshKey(k => k + 1);
    } else {
      console.log('✅ Update réussi ! Nouvelle ligne:', data);
      showToast("✅ Signalement marqué comme traité");
      setTimeout(() => setRefreshKey(k => k + 1), 500);
    }
  };

  // Autres actions simplifiées
  const dismissReport = async (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    await supabase.from('reports').update({ status: 'dismissed' }).eq('id', reportId);
    setTimeout(() => setRefreshKey(k => k + 1), 500);
    showToast("Signalement ignoré");
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm("Supprimer définitivement ?")) return;
    setReports(prev => prev.filter(r => r.id !== reportId));
    await supabase.from('reports').delete().eq('id', reportId);
    setTimeout(() => setRefreshKey(k => k + 1), 500);
    showToast("Signalement supprimé");
  };

  // === FONCTIONS ORIGINALES (Photos + Commentaires) ===
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
            {pendingReportsCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">{pendingReportsCount}</span>}
          </button>
        </div>

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
                      <Link href={`/creators/${group.creator.username}`} className="text-xl font-semibold hover:text-pink-400">
                        @{group.creator.username}
                      </Link>
                      <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-sm">
                        {group.count} signalement{group.count > 1 ? 's' : ''}
                      </span>
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
                            <button onClick={() => dismissReport(report.id)} className="bg-zinc-700 hover:bg-zinc-600 px-5 py-2.5 rounded-2xl text-sm">Ignorer</button>
                            <button onClick={() => deleteReport(report.id)} className="bg-red-600 hover:bg-red-500 px-5 py-2.5 rounded-2xl text-sm flex items-center gap-2">
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
