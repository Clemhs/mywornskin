'use client';

import { useState, useEffect, useMemo } from 'react';
import { MessageCircle, AlertTriangle, Image as ImageIcon, Send, Trash2, Flag, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'photos' | 'reviews' | 'messages' | 'reports'>('photos');
  const [reportFilter, setReportFilter] = useState<'pending' | 'reviewed' | 'dismissed' | 'all'>('pending');

  const [pendingPhotos, setPendingPhotos] = useState<any[]>([]);
  const [refusedReviews, setRefusedReviews] = useState<any[]>([]);
  const [adminMessages, setAdminMessages] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    console.log("Toast:", message);
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    console.log("Chargement des données - Tab:", activeTab);

    if (activeTab === 'photos') {
      const { data } = await supabase.from('profiles').select(`*`).or('avatar_status.eq.pending,banner_status.eq.pending');
      setPendingPhotos(data || []);
    }

    if (activeTab === 'reviews') {
      const { data } = await supabase.from('reviews').select('*').eq('status', 'rejected');
      setRefusedReviews(data || []);
    }

    if (activeTab === 'reports') {
      const { data, error } = await supabase
        .from('reports')
        .select(`*, creator:profiles!creator_id (username, full_name)`)
        .order('created_at', { ascending: false });

      if (error) console.error("Erreur reports:", error);
      else {
        console.log("Signalements chargés:", data?.length);
        setReports(data || []);
      }
    }

    // Compteur
    const { count } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    setPendingReportsCount(count || 0);
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    const interval = setInterval(loadData, 6000);
    return () => clearInterval(interval);
  }, []);

  // ACTIONS
  const markReportAsReviewed = async (reportId: string) => {
    console.log("Tentative de marquer comme traité:", reportId);
    const { error } = await supabase.from('reports').update({ status: 'reviewed' }).eq('id', reportId);
    
    if (error) {
      console.error("Erreur traité:", error);
      showToast("Erreur : " + error.message, "error");
    } else {
      showToast("✅ Signalement marqué comme traité");
      loadData();
    }
  };

  const dismissReport = async (reportId: string) => {
    console.log("Tentative d'ignorer:", reportId);
    const { error } = await supabase.from('reports').update({ status: 'dismissed' }).eq('id', reportId);
    if (error) showToast("Erreur : " + error.message, "error");
    else {
      showToast("Signalement ignoré");
      loadData();
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm("Supprimer définitivement ?")) return;
    const { error } = await supabase.from('reports').delete().eq('id', reportId);
    if (error) showToast("Erreur suppression", "error");
    else {
      showToast("Signalement supprimé");
      loadData();
    }
  };

  // === FONCTIONS ORIGINALES (PHOTOS + REVIEWS) ===
  const handlePhotoAction = async (profileId: string, type: 'avatar' | 'banner', action: 'approved' | 'rejected') => {
    // Ton code original (inchangé)
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
    // Ton code original
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      {/* ... Header et onglets identiques ... */}
      <div className="flex border-b border-zinc-800 mb-10 overflow-x-auto">
        {/* onglets identiques */}
      </div>

      {/* PHOTOS - CODE ORIGINAL */}
      {activeTab === 'photos' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {pendingPhotos.length === 0 ? (
            <p className="text-zinc-500 text-xl">Aucune photo en attente de validation.</p>
          ) : (
            pendingPhotos.map((p) => (
              <div key={p.id} className="bg-zinc-900 rounded-3xl p-8">
                <h3 className="font-semibold text-xl mb-6">@{p.username}</h3>
                {/* Ton code original des boutons Valider/Refuser */}
              </div>
            ))
          )}
        </div>
      )}

      {/* REVIEWS - CODE ORIGINAL */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Ton code original des commentaires refusés */}
        </div>
      )}

      {/* SIGNALEMENTS */}
      {activeTab === 'reports' && (
        <div>
          {/* ... reste du code signalements avec boutons ... */}
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' && <CheckCircle size={22} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
