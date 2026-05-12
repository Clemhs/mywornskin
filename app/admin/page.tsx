'use client';

import { useState, useEffect, useMemo } from 'react';
import { MessageCircle, AlertTriangle, Image as ImageIcon, Send, Trash2, Flag, CheckCircle, ShieldCheck, XCircle, Search, X, RefreshCw, Play } from 'lucide-react';
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
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    if (activeTab === 'products') {
      let query = supabase
        .from('products')
        .select(`
          id, title, description, story, price, size, shoe_size, category, video_url, voice_url,
          images, verification_images, status, created_at, creator_id,
          profiles:creator_id (username, full_name)
        `)
        .eq('status', 'pending');

      if (searchTerm) query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

      const { data } = await query.order('created_at', { ascending: sortBy === 'newest' });
      setPendingProducts(data || []);
    }

    if (activeTab === 'photos') {
      const { data } = await supabase
        .from('profiles')
        .select(`id, username, full_name, avatar_url, banner_url, avatar_pending_url, banner_pending_url, avatar_status, banner_status`)
        .or('avatar_status.eq.pending,banner_status.eq.pending')
        .order('updated_at', { ascending: false });
      setPendingPhotos(data || []);
    }

    if (activeTab === 'reviews') {
      const { data } = await supabase.from('reviews').select('*').eq('status', 'rejected').order('created_at', { ascending: false });
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

    const { count } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    setPendingReportsCount(count || 0);
  };

  useEffect(() => {
    loadData();
  }, [activeTab, refreshKey, searchTerm, sortBy]);

  const creatorRefusalCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    refusedReviews.forEach(r => counts[r.creator_id] = (counts[r.creator_id] || 0) + 1);
    return counts;
  }, [refusedReviews]);

  const reportsByCreator = useMemo(() => {
    const grouped: any = {};
    reports.forEach(report => {
      const key = report.creator_id;
      if (!grouped[key]) grouped[key] = { creator: report.creator, count: 0, reports: [] };
      grouped[key].count++;
      grouped[key].reports.push(report);
    });
    return Object.values(grouped);
  }, [reports]);

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
    showToast("✅ Toutes les données ont été rafraîchies");
  };

  const approveProduct = async (id: string) => {
    const { error } = await supabase.from('products').update({ status: 'approved' }).eq('id', id);
    if (error) showToast("Erreur", "error");
    else { showToast("Produit approuvé ✅"); setRefreshKey(k => k + 1); }
  };

  const rejectProduct = async (id: string) => {
    const { error } = await supabase.from('products').update({ status: 'rejected' }).eq('id', id);
    if (error) showToast("Erreur", "error");
    else { showToast("Produit refusé"); setRefreshKey(k => k + 1); }
  };

  const handlePhotoAction = async (profileId: string, type: 'avatar' | 'banner', action: 'approved' | 'rejected') => {
    const pendingField = type === 'avatar' ? 'avatar_pending_url' : 'banner_pending_url';
    const mainField = type === 'avatar' ? 'avatar_url' : 'banner_url';
    const statusField = type === 'avatar' ? 'avatar_status' : 'banner_status';

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', profileId).single();

    if (action === 'approved' && profile?.[pendingField]) {
      await supabase.from('profiles').update({ [mainField]: profile[pendingField], [pendingField]: null, [statusField]: 'approved' }).eq('id', profileId);
    } else {
      await supabase.from('profiles').update({ [pendingField]: null, [statusField]: 'rejected' }).eq('id', profileId);
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
    const { error } = await supabase.from('admin_messages').insert({ review_id: selectedReview.id, creator_id: selectedReview.creator_id, admin_message: adminReply });
    if (error) showToast("Erreur lors de l'envoi", "error");
    else { showToast("✅ Message envoyé"); setAdminReply(""); setSelectedReview(null); }
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Administration MyWornSkin</h1>
          <button onClick={handleRefresh} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-2xl text-sm font-medium transition">
            <RefreshCw size={18} /> Rafraîchir tout
          </button>
        </div>

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
            <MessageCircle size={22} /> Messages ({adminMessages.length})
          </button>
          <button onClick={() => setActiveTab('reports')} className={`px-8 py-4 font-medium flex items-center gap-3 whitespace-nowrap relative ${activeTab === 'reports' ? 'border-b-4 border-pink-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
            <Flag size={22} /> Signalements
            {pendingReportsCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">{pendingReportsCount}</span>}
          </button>
        </div>

        {/* ==================== PRODUITS EN ATTENTE (hauteur adaptative) ==================== */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-3xl pl-11 py-3 focus:outline-none focus:border-rose-500" />
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="bg-zinc-900 border border-zinc-700 rounded-3xl px-5 py-3">
                <option value="newest">Plus récents</option>
                <option value="oldest">Plus anciens</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pendingProducts.map((p) => (
                <div key={p.id} className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 flex flex-col h-fit">
                  {/* Photos publiques + Vérification Real Worn */}
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {p.images?.map((url: string, i: number) => (
                      <img key={i} src={url} className="h-28 w-28 object-cover rounded-2xl cursor-pointer flex-shrink-0" onClick={() => setSelectedImage(url)} />
                    ))}
                  </div>

                  {p.verification_images?.length > 0 && (
                    <div className="px-4 pb-4">
                      <p className="text-emerald-400 text-xs flex items-center gap-1 mb-2"><ShieldCheck size={14} /> Vérification Real Worn</p>
                      <div className="flex gap-2 overflow-x-auto">
                        {p.verification_images.map((url: string, i: number) => (
                          <img key={i} src={url} className="h-28 w-28 object-cover rounded-2xl border border-emerald-500/30 cursor-pointer flex-shrink-0" onClick={() => setSelectedImage(url)} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-5 flex flex-col">
                    <Link href={`/creators/${p.profiles?.username}`} className="text-rose-400 hover:underline text-sm">@{p.profiles?.username || 'inconnu'}</Link>

                    <div className="mt-4 space-y-3 text-sm text-zinc-400">
                      <div><span className="font-medium text-zinc-300">Type :</span> {p.category || '—'}</div>
                      <div className="flex gap-6">
                        {p.size && <div><span className="font-medium text-zinc-300">Taille :</span> {p.size}</div>}
                        {p.shoe_size && <div><span className="font-medium text-zinc-300">Pointure :</span> {p.shoe_size}</div>}
                      </div>
                      <div><span className="font-medium text-zinc-300">Titre :</span> <span className="break-words">{p.title}</span></div>

                      <div className="max-h-32 overflow-y-auto pr-2">
                        <span className="font-medium text-zinc-300">Description :</span>
                        <p className="break-words whitespace-pre-wrap mt-1">{p.description || "—"}</p>
                      </div>

                      {p.story && (
                        <div className="max-h-40 overflow-y-auto pr-2">
                          <span className="font-medium text-zinc-300">Histoire intime :</span>
                          <p className="break-words whitespace-pre-wrap mt-1">{p.story}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 pt-2">
                        {p.video_url && <button onClick={() => setPlayingVideo(p.video_url)} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-2xl text-sm"><Play size={16} /> Vidéo</button>}
                        {p.voice_url && <button onClick={() => { const a = new Audio(p.voice_url); a.play(); }} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-2xl text-sm">🎤 Vocal</button>}
                      </div>
                    </div>

                    <div className="text-3xl font-bold text-rose-400 mt-auto pt-6">{p.price} €</div>

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

        {/* Les autres onglets restent exactement comme avant (non modifiés) */}
        {/* ... (photos, reviews, messages, reports, modals, toast) ... */}

        {/* MODALS (identiques) */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-5xl max-h-[90vh]">
              <img src={selectedImage} alt="" className="max-h-[90vh] rounded-3xl" />
              <button onClick={() => setSelectedImage(null)} className="absolute -top-4 -right-4 bg-black/70 hover:bg-red-600 text-white p-4 rounded-full text-xl">✕</button>
            </div>
          </div>
        )}

        {playingVideo && (
          <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4" onClick={() => setPlayingVideo(null)}>
            <div className="relative max-w-4xl w-full">
              <video controls autoPlay className="w-full rounded-3xl" src={playingVideo} />
              <button onClick={() => setPlayingVideo(null)} className="absolute -top-4 -right-4 bg-black/70 hover:bg-red-600 text-white p-4 rounded-full text-xl">✕</button>
            </div>
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
