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

  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<any[]>([]);
  const [refusedReviews, setRefusedReviews] = useState<any[]>([]);
  const [adminMessages, setAdminMessages] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [adminReply, setAdminReply] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    if (activeTab === 'products') {
      let query = supabase
        .from('products')
        .select(`
          id, title, description, story, price, size, shoe_size, images, verification_images, status, created_at, creator_id,
          profiles:creator_id (username, full_name)
        `)
        .eq('status', 'pending');

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data } = await query.order('created_at', { ascending: sortBy === 'newest' });
      setPendingProducts(data || []);
    }

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

    if (activeTab === 'messages') {
      const { data } = await supabase
        .from('messages')
        .select(`*, sender:profiles!sender_id (username)`)
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
  }, [activeTab, refreshKey, searchTerm, sortBy]);

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
    showToast("✅ Toutes les données ont été rafraîchies");
  };

  // ==================== ACTIONS ====================
  const approveProduct = async (id: string) => {
    const { error } = await supabase.from('products').update({ status: 'approved' }).eq('id', id);
    if (error) showToast("Erreur lors de l'approbation", "error");
    else {
      showToast("✅ Produit approuvé");
      setRefreshKey(k => k + 1);
    }
  };

  const rejectProduct = async (id: string) => {
    const { error } = await supabase.from('products').update({ status: 'rejected' }).eq('id', id);
    if (error) showToast("Erreur lors du refus", "error");
    else {
      showToast("❌ Produit refusé");
      setRefreshKey(k => k + 1);
    }
  };

  const handlePhotoAction = async (profileId: string, type: 'avatar' | 'banner', action: 'approved' | 'rejected') => {
    const pendingField = type === 'avatar' ? 'avatar_pending_url' : 'banner_pending_url';
    const mainField = type === 'avatar' ? 'avatar_url' : 'banner_url';
    const statusField = type === 'avatar' ? 'avatar_status' : 'banner_status';

    // Correction TypeScript : on sélectionne les deux champs possibles
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_pending_url, banner_pending_url')
      .eq('id', profileId)
      .single();

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
    if (!selectedReview || !adminReply.trim()) return;
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

  const markReportAsReviewed = async (reportId: string) => {
    await supabase.from('reports').update({ status: 'reviewed' }).eq('id', reportId);
    showToast("✅ Signalement traité");
    setRefreshKey(k => k + 1);
  };

  const dismissReport = async (reportId: string) => {
    await supabase.from('reports').update({ status: 'dismissed' }).eq('id', reportId);
    showToast("Signalement ignoré");
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
          <button onClick={() => setActiveTab('products')} className={`px-8 py-4 font-medium flex items-center gap-3 whitespace-nowrap ${activeTab === 'products' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <ShieldCheck size={22} /> Produits en attente ({pendingProducts.length})
          </button>
          <button onClick={() => setActiveTab('photos')} className={`px-8 py-4 font-medium flex items-center gap-3 whitespace-nowrap ${activeTab === 'photos' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <ImageIcon size={22} /> Photos en attente ({pendingPhotos.length})
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`px-8 py-4 font-medium flex items-center gap-3 whitespace-nowrap ${activeTab === 'reviews' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <AlertTriangle size={22} /> Commentaires refusés ({refusedReviews.length})
          </button>
          <button onClick={() => setActiveTab('messages')} className={`px-8 py-4 font-medium flex items-center gap-3 whitespace-nowrap ${activeTab === 'messages' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <MessageCircle size={22} /> Messages reçus ({adminMessages.length})
          </button>
          <button onClick={() => setActiveTab('reports')} className={`px-8 py-4 font-medium flex items-center gap-3 whitespace-nowrap relative ${activeTab === 'reports' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <Flag size={22} /> Signalements
            {pendingReportsCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">{pendingReportsCount}</span>}
          </button>
        </div>

        {/* PRODUITS EN ATTENTE */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un titre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-3xl pl-11 py-3 focus:outline-none focus:border-rose-500"
                />
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="bg-zinc-900 border border-zinc-700 rounded-3xl px-5 py-3">
                <option value="newest">Plus récents</option>
                <option value="oldest">Plus anciens</option>
              </select>
            </div>

            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <ShieldCheck className="text-emerald-400" /> Produits en attente de validation ({pendingProducts.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pendingProducts.map((p) => (
                <div key={p.id} className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 flex flex-col">
                  <div className="p-4">
                    <p className="text-xs text-zinc-400 mb-2">Photos publiques</p>
                    <div className="flex gap-2 overflow-x-auto pb-3">
                      {p.images?.map((url: string, i: number) => (
                        <img key={i} src={url} alt="" className="h-28 w-28 object-cover rounded-2xl cursor-pointer flex-shrink-0" onClick={() => setSelectedImage(url)} />
                      ))}
                    </div>
                  </div>

                  {p.verification_images?.length > 0 && (
                    <div className="px-4 pb-4">
                      <p className="text-xs text-emerald-400 flex items-center gap-1 mb-2">
                        <ShieldCheck size={14} /> Vérification Real Worn
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-3">
                        {p.verification_images.map((url: string, i: number) => (
                          <img key={i} src={url} alt="" className="h-28 w-28 object-cover rounded-2xl border border-emerald-500/30 cursor-pointer flex-shrink-0" onClick={() => setSelectedImage(url)} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col">
                    <Link href={`/creators/${p.profiles?.username}`} className="text-rose-400 hover:underline text-sm mb-1">
                      @{p.profiles?.username || 'inconnu'}
                    </Link>
                    <h3 className="font-semibold line-clamp-2 text-lg mb-3">{p.title}</h3>

                    {/* Description - 2 lignes */}
                    <div className="text-sm text-zinc-400 mb-4 max-h-20 overflow-y-auto pr-2">
                      <p className="font-medium text-zinc-300 mb-1">Description :</p>
                      <p>{p.description || "Aucune description"}</p>
                    </div>

                    {/* Histoire intime - 3 lignes */}
                    {p.story && (
                      <div className="text-sm text-zinc-400 mb-6 max-h-28 overflow-y-auto pr-2">
                        <p className="font-medium text-zinc-300 mb-1">Histoire intime :</p>
                        <p>{p.story}</p>
                      </div>
                    )}

                    <div className="text-3xl font-bold text-rose-400 mt-auto">
                      {p.price} €
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button onClick={() => approveProduct(p.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3.5 rounded-2xl font-medium flex items-center justify-center gap-2">
                        <CheckCircle size={18} /> Approuver
                      </button>
                      <button onClick={() => rejectProduct(p.id)} className="flex-1 bg-red-600 hover:bg-red-500 py-3.5 rounded-2xl font-medium flex items-center justify-center gap-2">
                        <XCircle size={18} /> Refuser
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PHOTOS EN ATTENTE */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pendingPhotos.length === 0 ? (
              <p className="text-zinc-500 text-xl">Aucune photo en attente.</p>
            ) : (
              pendingPhotos.map((p) => (
                <div key={p.id} className="bg-zinc-900 rounded-3xl p-8">
                  <Link href={`/creators/${p.username}`} className="font-semibold text-xl hover:text-pink-400">
                    @{p.username}
                  </Link>

                  {p.avatar_pending_url && (
                    <div className="mt-6">
                      <p className="text-pink-400 mb-4">Photo de profil</p>
                      <img src={p.avatar_pending_url} className="w-48 h-48 rounded-2xl object-cover mb-6" />
                      <div className="flex gap-4">
                        <button onClick={() => handlePhotoAction(p.id, 'avatar', 'approved')} className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl">✅ Valider</button>
                        <button onClick={() => handlePhotoAction(p.id, 'avatar', 'rejected')} className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl">❌ Refuser</button>
                      </div>
                    </div>
                  )}

                  {p.banner_pending_url && (
                    <div className="mt-10">
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
            ) : (
              refusedReviews.map(review => (
                <div key={review.id} className="bg-zinc-900 rounded-3xl p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <Link href={`/creators/${review.creator_id}`} className="font-semibold text-xl hover:text-pink-400">
                        Créatrice
                      </Link>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => forcePublishReview(review.id)} className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-2xl text-sm font-medium">Publier quand même</button>
                      <button onClick={() => ignoreReview(review.id)} className="bg-zinc-700 hover:bg-zinc-600 px-6 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
                        <Trash2 size={16} /> Ignorer
                      </button>
                    </div>
                  </div>
                  <p className="italic text-lg mb-4">"{review.comment}"</p>
                  <button onClick={() => setSelectedReview(review)} className="mt-6 text-pink-400 hover:text-pink-300 flex items-center gap-2 font-medium">
                    <MessageCircle size={20} /> Envoyer un message à la créatrice
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            {adminMessages.length === 0 ? (
              <p className="text-zinc-500 text-xl py-12">Aucun message reçu pour le moment.</p>
            ) : (
              adminMessages.map((msg) => (
                <div key={msg.id} className="bg-zinc-900 rounded-3xl p-8">
                  <div className="flex justify-between mb-4">
                    <Link href={`/creators/${msg.sender?.username}`} className="font-semibold text-lg hover:text-pink-400">
                      @{msg.sender?.username || 'Créatrice'}
                    </Link>
                    <span className="text-xs text-zinc-500">
                      {new Date(msg.created_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{msg.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* SIGNALEMENTS */}
        {activeTab === 'reports' && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3.5 text-zinc-500" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher raison ou créatrice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 pl-11 py-3.5 rounded-2xl focus:outline-none focus:border-pink-500"
                />
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3.5">
                <option value="newest">Plus récents</option>
                <option value="oldest">Plus anciens</option>
                <option value="most">Plus de signalements</option>
              </select>
              <select value={reportFilter} onChange={(e) => setReportFilter(e.target.value as any)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3.5">
                <option value="pending">En attente</option>
                <option value="reviewed">Traités</option>
                <option value="dismissed">Ignorés</option>
                <option value="all">Tous</option>
              </select>
            </div>

            {reports.length === 0 ? (
              <p className="text-zinc-500 text-xl py-12">Aucun signalement.</p>
            ) : (
              <div className="space-y-8">
                {reports.map((report) => (
                  <div key={report.id} className="bg-zinc-900 rounded-3xl p-8">
                    <div className="flex justify-between mb-4">
                      <Link href={`/creators/${report.creator?.username}`} className="text-xl font-semibold hover:text-pink-400">
                        @{report.creator?.username}
                      </Link>
                      <span className="text-xs text-zinc-500">{new Date(report.created_at).toLocaleString('fr-FR')}</span>
                    </div>
                    <p className="italic text-zinc-300">"{report.reason}"</p>
                    <div className="mt-6 flex gap-3">
                      <button onClick={() => markReportAsReviewed(report.id)} className="bg-green-600 hover:bg-green-500 px-5 py-2.5 rounded-2xl text-sm flex items-center gap-2">
                        <CheckCircle size={16} /> Marquer comme traité
                      </button>
                      <button onClick={() => dismissReport(report.id)} className="bg-zinc-700 hover:bg-zinc-600 px-5 py-2.5 rounded-2xl text-sm">Ignorer</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODALS & TOAST */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200]">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Envoyer un message</h3>
                <button onClick={() => { setSelectedReview(null); setAdminReply(""); }} className="text-zinc-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <p className="text-zinc-400 mb-2">Commentaire concerné :</p>
              <p className="italic mb-6">"{selectedReview.comment}"</p>
              <textarea
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                placeholder="Écris ton message ici..."
                className="w-full h-40 bg-zinc-950 border border-zinc-700 rounded-2xl p-4 focus:outline-none focus:border-pink-500 resize-y"
              />
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setSelectedReview(null); setAdminReply(""); }} className="flex-1 py-4 rounded-2xl border border-zinc-700 hover:bg-zinc-800">Annuler</button>
                <button onClick={sendAdminMessage} disabled={!adminReply.trim()} className="flex-1 py-4 rounded-2xl bg-pink-600 hover:bg-pink-500 disabled:opacity-50 font-medium flex items-center justify-center gap-2">
                  <Send size={18} /> Envoyer
                </button>
              </div>
            </div>
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
