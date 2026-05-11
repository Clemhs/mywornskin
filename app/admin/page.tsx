'use client';

import { useState, useEffect, useMemo } from 'react';
import { MessageCircle, AlertTriangle, Image as ImageIcon, Send, Trash2, Flag, CheckCircle, Search, X, ShieldCheck, XCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const ADMIN_ID = 'bc985ee6-d9dc-43e0-8069-b34deeea9e24';

export default function AdminPage() {
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'products' | 'photos' | 'reviews' | 'messages' | 'reports'>('products');
  const [reportFilter, setReportFilter] = useState<'pending' | 'reviewed' | 'dismissed' | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most'>('newest');
  const [refreshKey, setRefreshKey] = useState(0);

  const [pendingPhotos, setPendingPhotos] = useState<any[]>([]);
  const [refusedReviews, setRefusedReviews] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [adminMessages, setAdminMessages] = useState<any[]>([]);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);

  // Produits en attente
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [adminReply, setAdminReply] = useState("");

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    // Produits en attente
    if (activeTab === 'products') {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, description, price_1day, images, status, created_at, creator_id')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) console.error("Erreur produits:", error);
      else setPendingProducts(data || []);
    }

    // Photos en attente
    if (activeTab === 'photos') {
      const { data } = await supabase
        .from('profiles')
        .select(`
          id, username, full_name,
          avatar_url, banner_url,
          avatar_pending_url, banner_pending_url,
          avatar_status, banner_status
        `)
        .or('avatar_status.eq.pending,banner_status.eq.pending')
        .order('updated_at', { ascending: false });
      setPendingPhotos(data || []);
    }

    // Reviews refusés
    if (activeTab === 'reviews') {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'rejected')
        .order('created_at', { ascending: false });
      setRefusedReviews(data || []);
    }

    // Signalements
    if (activeTab === 'reports') {
      const { data } = await supabase
        .from('reports')
        .select(`*, creator:profiles!creator_id (username, full_name)`)
        .order('created_at', { ascending: false });
      setReports(data || []);
    }

    // Messages
    if (activeTab === 'messages') {
      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id (username)
        `)
        .eq('receiver_id', ADMIN_ID)
        .order('created_at', { ascending: false });
      setAdminMessages(data || []);
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

  const creatorRefusalCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    refusedReviews.forEach(r => {
      counts[r.creator_id] = (counts[r.creator_id] || 0) + 1;
    });
    return counts;
  }, [refusedReviews]);

  const filteredAndSortedReports = useMemo(() => {
    let result = [...reports];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(report => 
        report.reason?.toLowerCase().includes(term) ||
        report.creator?.username?.toLowerCase().includes(term)
      );
    }

    if (reportFilter !== 'all') {
      result = result.filter(r => r.status === reportFilter);
    }

    if (sortBy === 'newest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    else if (sortBy === 'most') {
      const countMap: { [key: string]: number } = {};
      result.forEach(r => countMap[r.creator_id] = (countMap[r.creator_id] || 0) + 1);
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
    return Object.values(grouped);
  }, [filteredAndSortedReports]);

  // ACTIONS PRODUITS
  const approveProduct = async (productId: string) => {
    const { error } = await supabase.from('products').update({ status: 'approved' }).eq('id', productId);
    if (error) showToast("Erreur approbation", "error");
    else {
      showToast("✅ Produit approuvé");
      setRefreshKey(k => k + 1);
    }
  };

  const rejectProduct = async (productId: string) => {
    const { error } = await supabase.from('products').update({ status: 'rejected' }).eq('id', productId);
    if (error) showToast("Erreur refus", "error");
    else {
      showToast("❌ Produit refusé");
      setRefreshKey(k => k + 1);
    }
  };

  // ACTIONS EXISTANTES
  const markReportAsReviewed = async (reportId: string) => {
    await supabase.from('reports').update({ status: 'reviewed' }).eq('id', reportId);
    showToast("✅ Signalement marqué comme traité");
    setRefreshKey(k => k + 1);
  };

  const dismissReport = async (reportId: string) => {
    await supabase.from('reports').update({ status: 'dismissed' }).eq('id', reportId);
    showToast("Signalement ignoré");
    setRefreshKey(k => k + 1);
  };

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
    showToast(action === 'approved' ? "✅ Photo validée" : "❌ Photo refusée");
  };

  const forcePublishReview = async (reviewId: string) => {
    await supabase.from('reviews').update({ status: 'approved' }).eq('id', reviewId);
    loadData();
    showToast("✅ Commentaire publié");
  };

  const ignoreReview = async (reviewId: string) => {
    await supabase.from('reviews').update({ status: 'ignored' }).eq('id', reviewId);
    loadData();
    showToast("Commentaire ignoré");
  };

  const sendAdminMessage = async () => {
    if (!selectedReview || !adminReply.trim()) {
      showToast("Veuillez écrire un message", "error");
      return;
    }

    const { error } = await supabase.from('admin_messages').insert({
      review_id: selectedReview.id,
      creator_id: selectedReview.creator_id,
      admin_message: adminReply,
    });

    if (error) showToast("Erreur lors de l'envoi", "error");
    else {
      showToast("✅ Message envoyé à la créatrice");
      setAdminReply("");
      setSelectedReview(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Administration MyWornSkin</h1>

        <div className="flex border-b border-zinc-800 mb-10 overflow-x-auto">
          <button onClick={() => setActiveTab('products')} className={`px-8 py-4 font-medium flex items-center gap-3 whitespace-nowrap ${activeTab === 'products' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <ShieldCheck size={22} /> Produits en attente
          </button>
          <button onClick={() => setActiveTab('photos')} className={`px-8 py-4 font-medium flex items-center gap-3 whitespace-nowrap ${activeTab === 'photos' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <ImageIcon size={22} /> Photos en attente
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`px-8 py-4 font-medium flex items-center gap-3 whitespace-nowrap ${activeTab === 'reviews' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <AlertTriangle size={22} /> Commentaires refusés
          </button>
          <button onClick={() => setActiveTab('messages')} className={`px-8 py-4 font-medium flex items-center gap-3 whitespace-nowrap ${activeTab === 'messages' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <MessageCircle size={22} /> Messages reçus
          </button>
          <button onClick={() => setActiveTab('reports')} className={`px-8 py-4 font-medium flex items-center gap-3 whitespace-nowrap relative ${activeTab === 'reports' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <Flag size={22} /> Signalements
            {pendingReportsCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                {pendingReportsCount}
              </span>
            )}
          </button>
        </div>

        {/* PRODUITS EN ATTENTE */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              Produits en attente de validation ({pendingProducts.length})
            </h2>

            {pendingProducts.length === 0 ? (
              <p className="text-zinc-500 text-xl py-12">Aucun produit en attente pour le moment.</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingProducts.map((p) => (
                  <div key={p.id} className="bg-zinc-900 rounded-3xl p-8">
                    <div className="flex gap-6">
                      {p.images?.[0] && (
                        <img src={p.images[0]} className="w-32 h-32 object-cover rounded-2xl" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl">{p.title}</h3>
                        <p className="text-rose-400">ID créateur : {p.creator_id}</p>
                        <p className="text-sm text-zinc-400 mt-3 line-clamp-3">{p.description}</p>
                        <p className="mt-4 text-rose-400 font-medium">{p.price_1day} €</p>
                      </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                      <button onClick={() => approveProduct(p.id)} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-medium flex items-center justify-center gap-2">
                        <CheckCircle size={20} /> Approuver
                      </button>
                      <button onClick={() => rejectProduct(p.id)} className="flex-1 py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-medium flex items-center justify-center gap-2">
                        <XCircle size={20} /> Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PHOTOS EN ATTENTE */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pendingPhotos.length === 0 ? (
              <p className="text-zinc-500 text-xl">Aucune photo en attente de validation.</p>
            ) : (
              pendingPhotos.map((p) => (
                <div key={p.id} className="bg-zinc-900 rounded-3xl p-8">
                  <h3 className="font-semibold text-xl mb-6">@{p.username}</h3>
                  {p.avatar_pending_url && (
                    <div className="mb-12">
                      <p className="text-pink-400 mb-4">Photo de profil</p>
                      <img src={p.avatar_pending_url} className="w-48 h-48 rounded-2xl object-cover mb-6" />
                      <div className="flex gap-4">
                        <button onClick={() => handlePhotoAction(p.id, 'avatar', 'approved')} className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl">✅ Valider</button>
                        <button onClick={() => handlePhotoAction(p.id, 'avatar', 'rejected')} className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl">❌ Refuser</button>
                      </div>
                    </div>
                  )}
                  {p.banner_pending_url && (
                    <div>
                      <p className="text-pink-400 mb-4">Photo de couverture</p>
                      <img src={p.banner_pending_url} className="w-full h-64 object-cover rounded-2xl mb-6" />
                      <div className="flex gap-4">
                        <button onClick={() => handlePhotoAction(p.id, 'banner', 'approved')} className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl">✅ Valider</button>
                        <button onClick={() => handlePhotoAction(p.id, 'banner', 'rejected')} className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl">❌ Refuser</button>
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
            {refusedReviews.length === 0 ? (
              <p className="text-zinc-500 text-lg">Aucun commentaire refusé pour le moment.</p>
           
