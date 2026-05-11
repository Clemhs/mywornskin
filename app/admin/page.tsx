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
    console.log('🔄 loadData appelé');

    if (activeTab === 'reports') {
      const { data, error } = await supabase
        .from('reports')
        .select(`*, creator:profiles!creator_id (username, full_name)`)
        .order('created_at', { ascending: false });

      if (error) console.error('❌ Erreur chargement reports:', error);
      console.log('📥 Reports reçus du serveur:', data?.length || 0);
      setReports(data || []);
    }

    const { count } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    console.log('🔢 Compteur pending:', count);
    setPendingReportsCount(count || 0);
  };

  useEffect(() => {
    loadData();
  }, [activeTab, refreshKey]);

  const reportsByCreator = useMemo(() => {
    const grouped: any = {};
    reports.forEach(report => {  // On utilise reports directement (pas filtered pour le moment)
      const key = report.creator_id;
      if (!grouped[key]) grouped[key] = { creator: report.creator, count: 0, reports: [] };
      grouped[key].count++;
      grouped[key].reports.push(report);
    });
    return Object.values(grouped).sort((a: any, b: any) => b.count - a.count);
  }, [reports]);

  const markReportAsReviewed = async (reportId: string) => {
    console.log('🟢 Tentative de marquage traité pour ID:', reportId);

    // Optimiste
    setReports(prev => prev.filter(r => r.id !== reportId));

    const { error } = await supabase
      .from('reports')
      .update({ status: 'reviewed' })
      .eq('id', reportId)
      .select();   // On récupère la ligne mise à jour

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      showToast("Erreur lors de la mise à jour", "error");
      setRefreshKey(k => k + 1);
    } else {
      console.log('✅ Update réussi dans Supabase !');
      showToast("✅ Signalement marqué comme traité");
      // On attend un peu avant de recharger pour laisser Supabase propager
      setTimeout(() => setRefreshKey(k => k + 1), 300);
    }
  };

  // Autres actions (similaires)
  const dismissReport = async (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    await supabase.from('reports').update({ status: 'dismissed' }).eq('id', reportId);
    setTimeout(() => setRefreshKey(k => k + 1), 300);
    showToast("Signalement ignoré");
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm("Supprimer définitivement ?")) return;
    setReports(prev => prev.filter(r => r.id !== reportId));
    await supabase.from('reports').delete().eq('id', reportId);
    setTimeout(() => setRefreshKey(k => k + 1), 300);
    showToast("Signalement supprimé");
  };

  // === FONCTIONS ORIGINALES (Photos + Commentaires) ===
  const handlePhotoAction = async (profileId: string, type: 'avatar' | 'banner', action: 'approved' | 'rejected') => {
    // ... ton code original complet ...
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

        {/* Tabs - identique à avant */}
        <div className="flex border-b border-zinc-800 mb-10 overflow-x-auto">
          {/* ... tes 4 boutons tabs ... */}
        </div>

        {/* SIGNALEMENTS */}
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

            {/* Liste des signalements */}
            {reports.length === 0 ? (
              <p className="text-zinc-500 text-xl">Aucun signalement pour le moment.</p>
            ) : (
              <div className="space-y-8">
                {reportsByCreator.map((group: any) => (
                  <div key={group.creator.id} className="bg-zinc-900 rounded-3xl p-8">
                    {/* ... card créatrice ... */}
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

        {/* TOAST */}
        {toast && (
          <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl z-[100] ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
