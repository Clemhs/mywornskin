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
    console.log('🔄 loadData appelé - activeTab:', activeTab);

    if (activeTab === 'reports') {
      const { data, error } = await supabase
        .from('reports')
        .select(`*, creator:profiles!creator_id (username, full_name)`)
        .order('created_at', { ascending: false });

      if (error) console.error('Erreur load reports:', error);
      console.log('📥 Reports chargés:', data?.length, data);
      setReports(data || []);
    }

    // Compteur
    const { count } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    setPendingReportsCount(count || 0);
  };

  useEffect(() => {
    loadData();
  }, [activeTab, refreshKey]);

  // === ACTION PRINCIPALE ===
  const markReportAsReviewed = async (reportId: string) => {
    console.log('🟢 markReportAsReviewed appelé pour ID:', reportId);

    // Mise à jour optimiste
    setReports(prev => prev.filter(r => r.id !== reportId));

    const { error } = await supabase
      .from('reports')
      .update({ status: 'reviewed' })
      .eq('id', reportId);

    if (error) {
      console.error('❌ Erreur Supabase update:', error);
      showToast("Erreur lors de la mise à jour", "error");
      setRefreshKey(k => k + 1); // rollback
    } else {
      console.log('✅ Update réussi dans Supabase');
      showToast("✅ Signalement marqué comme traité");
      setRefreshKey(k => k + 1);
    }
  };

  const dismissReport = async (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    const { error } = await supabase.from('reports').update({ status: 'dismissed' }).eq('id', reportId);
    if (error) setRefreshKey(k => k + 1);
    else showToast("Signalement ignoré");
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm("Supprimer définitivement ?")) return;
    setReports(prev => prev.filter(r => r.id !== reportId));
    const { error } = await supabase.from('reports').delete().eq('id', reportId);
    if (error) setRefreshKey(k => k + 1);
    else showToast("Signalement supprimé");
  };

  // === FONCTIONS ORIGINALES (gardées) ===
  const handlePhotoAction = async (...) => { /* ton code original */ };
  const forcePublishReview = async (...) => { /* ton code original */ };
  const ignoreReview = async (...) => { /* ton code original */ };
  const sendAdminMessage = async (...) => { /* ton code original */ };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      {/* ... tout ton JSX (tabs + sections photos/reviews) ... */}

      {activeTab === 'reports' && (
        <div key={refreshKey}>
          {/* filtre + header */}
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-semibold">Signalements ({reports.length})</h2>
            {/* select filter */}
          </div>

          {reports.length === 0 ? (
            <p>Aucun signalement</p>
          ) : (
            <div className="space-y-8">
              {reportsByCreator.map((group: any) => (
                <div key={group.creator.id} className="bg-zinc-900 rounded-3xl p-8">
                  {/* ... card créatrice ... */}
                  {group.reports.map((report: any) => (
                    <div key={report.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 mb-4">
                      <p>"{report.reason}"</p>
                      <p className="text-xs text-zinc-500">{new Date(report.created_at).toLocaleString('fr-FR')}</p>

                      <div className="mt-6 flex gap-3">
                        <button onClick={() => markReportAsReviewed(report.id)} className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-2xl">
                          Marquer comme traité
                        </button>
                        <button onClick={() => dismissReport(report.id)} className="bg-zinc-700 hover:bg-zinc-600 px-6 py-3 rounded-2xl">Ignorer</button>
                        <button onClick={() => deleteReport(report.id)} className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-2xl">Supprimer</button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
