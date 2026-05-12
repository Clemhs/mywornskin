'use client';

import { useState, useEffect, useMemo } from 'react';
import { MessageCircle, AlertTriangle, Image as ImageIcon, Send, Trash2, Flag, CheckCircle, ShieldCheck, XCircle, Search, X, RefreshCw } from 'lucide-react';
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

  // Products
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);

  // Photos
  const [pendingPhotos, setPendingPhotos] = useState<any[]>([]);

  // Commentaires refusés
  const [refusedReviews, setRefusedReviews] = useState<any[]>([]);

  // Messages
  const [adminMessages, setAdminMessages] = useState<any[]>([]);

  // Signalements
  const [reports, setReports] = useState<any[]>([]);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [adminReply, setAdminReply] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };

  const loadData = async () => {
    // Produits en attente
    const { data: productsData } = await supabase
      .from('products')
      .select(`
        id, title, description, story, price, size, shoe_size, images, verification_images, status, created_at, creator_id,
        profiles:creator_id (username, full_name)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    setPendingProducts(productsData || []);

    // Photos en attente
    const { data: photosData } = await supabase
      .from('profiles')
      .select(`
        id, username, full_name,
        avatar_url, banner_url,
        avatar_pending_url, banner_pending_url,
        avatar_status, banner_status
      `)
      .or('avatar_status.eq.pending,banner_status.eq.pending')
      .order('updated_at', { ascending: false });
    setPendingPhotos(photosData || []);

    // Commentaires refusés
    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', 'rejected')
      .order('created_at', { ascending: false });
    setRefusedReviews(reviewsData || []);

    // Messages
    const { data: messagesData } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!sender_id (username)
      `)
      .eq('receiver_id', ADMIN_ID)
      .order('created_at', { ascending: false });
    setAdminMessages(messagesData || []);

    // Signalements
    const { data: reportsData } = await supabase
      .from('reports')
      .select(`*, creator:profiles!creator_id (username, full_name)`)
      .order('created_at', { ascending: false });
    setReports(reportsData || []);

    // Compteur signalements en attente
    const { count } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    setPendingReportsCount(count || 0);
  };

  useEffect(() => {
    loadData();
  }, [activeTab, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
    showToast("✅ Toutes les données ont été rafraîchies", "success");
  };

  // === ACTIONS ===
  const approveProduct = async (id: string) => {
    await supabase.from('products').update({ status: 'approved' }).eq('id', id);
    showToast("Produit approuvé ✅");
    setRefreshKey(k => k + 1);
  };

  const rejectProduct = async (id: string) => {
    await supabase.from('products').update({ status: 'rejected' }).eq('id', id);
    showToast("Produit refusé");
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
    if (!selectedReview || !adminReply.trim()) return showToast("Veuillez écrire un message", "error");

    await supabase.from('admin_messages').insert({
      review_id: selectedReview.id,
      creator_id: selectedReview.creator_id,
      admin_message: adminReply,
    });
    showToast("✅ Message envoyé à la créatrice");
    setAdminReply("");
    setSelectedReview(null);
  };

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

  const deleteReport = async (reportId: string) => {
    if (!confirm("Supprimer définitivement ce signalement ?")) return;
    await supabase.from('reports').delete().eq('id', reportId);
    showToast("Signalement supprimé");
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Administration MyWornSkin</h1>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-2xl text-sm font-medium transition"
          >
            <RefreshCw size={18} /> Rafraîchir tout
          </button>
        </div>

        {/* Onglets */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-4 mb-10">
          <button 
            onClick={() => setActiveTab('products')} 
            className={`px-6 py-3 rounded-2xl font-medium flex items-center gap-2 transition ${activeTab === 'products' ? 'bg-pink-600 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'}`}
          >
            <ShieldCheck size={20} /> Produits en attente ({pendingProducts.length})
          </button>
          <button 
            onClick={() => setActiveTab('photos')} 
            className={`px-6 py-3 rounded-2xl font-medium flex items-center gap-2 transition ${activeTab === 'photos' ? 'bg-pink-600 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'}`}
          >
            <ImageIcon size={20} /> Photos en attente ({pendingPhotos.length})
          </button>
          <button 
            onClick={() => setActiveTab('reviews')} 
            className={`px-6 py-3 rounded-2xl font-medium flex items-center gap-2 transition ${activeTab === 'reviews' ? 'bg-pink-600 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'}`}
          >
            <AlertTriangle size={20} /> Commentaires refusés ({refusedReviews.length})
          </button>
          <button 
            onClick={() => setActiveTab('messages')} 
            className={`px-6 py-3 rounded-2xl font-medium flex items-center gap-2 transition ${activeTab === 'messages' ? 'bg-pink-600 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'}`}
          >
            <MessageCircle size={20} /> Messages reçus ({adminMessages.length})
          </button>
          <button 
            onClick={() => setActiveTab('reports')} 
            className={`px-6 py-3 rounded-2xl font-medium flex items-center gap-2 transition relative ${activeTab === 'reports' ? 'bg-pink-600 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'}`}
          >
            <Flag size={20} /> Signalements ({pendingReportsCount})
          </button>
        </div>

        {/* ==================== PRODUITS EN ATTENTE ==================== */}
        {activeTab === 'products' && (
          <div>
            {/* Ton code produits existant ici */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pendingProducts.map((p) => (
                <div key={p.id} className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 flex flex-col">
                  {/* ... ton code existant pour les produits ... */}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== PHOTOS EN ATTENTE ==================== */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pendingPhotos.map((p) => (
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
            ))}
          </div>
        )}

        {/* ==================== COMMENTAIRES REFUSÉS ==================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {refusedReviews.length === 0 ? (
              <p className="text-zinc-500 text-lg">Aucun commentaire refusé pour le moment.</p>
            ) : (
              refusedReviews.map(review => (
                <div key={review.id} className="bg-zinc-900 rounded-3xl p-8">
                  {/* Ton code existant pour les commentaires refusés */}
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== MESSAGES REÇUS ==================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            {adminMessages.length === 0 ? (
              <p className="text-zinc-500 text-xl py-12">Aucun message reçu pour le moment.</p>
            ) : (
              adminMessages.map((msg) => (
                <div key={msg.id} className="bg-zinc-900 rounded-3xl p-8">
                  {/* Ton code existant pour les messages */}
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== SIGNALEMENTS ==================== */}
        {activeTab === 'reports' && (
          <div>
            {/* Ton code existant pour les signalements */}
          </div>
        )}

        {/* MODALS ET TOAST (inchangés) */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200]">
            {/* Ton modal message existant */}
          </div>
        )}

        {toast && (
          <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast.type === 'success' && <CheckCircle size={22} />}
            <span className="font-medium">{toast.message}</span>
          </div>
        )}

        {selectedImage && (
          <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-5xl max-h-[90vh]">
              <img src={selectedImage} alt="Agrandie" className="max-h-[90vh] rounded-3xl" />
              <button onClick={() => setSelectedImage(null)} className="absolute -top-4 -right-4 bg-black/70 hover:bg-red-600 text-white p-4 rounded-full text-xl">✕</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
