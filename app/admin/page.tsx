'use client';

import { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, Image as ImageIcon, AlertTriangle, MessageCircle, Flag, CheckCircle, XCircle, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const ADMIN_ID = 'bc985ee6-d9dc-43e0-8069-b34deeea9e24';

export default function AdminPage() {
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'products' | 'photos' | 'reviews' | 'messages' | 'reports'>('products');
  const [refreshKey, setRefreshKey] = useState(0);

  // Products tab
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Autres onglets (gardés pour ne rien perdre)
  const [pendingPhotos, setPendingPhotos] = useState<any[]>([]);
  const [refusedReviews, setRefusedReviews] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [adminMessages, setAdminMessages] = useState<any[]>([]);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };

  const loadData = async () => {
    if (activeTab === 'products') {
      let query = supabase
        .from('products')
        .select(`
          id, title, description, price, size, shoe_size, images, verification_images, status, created_at, creator_id,
          profiles:creator_id (username, full_name)
        `)
        .eq('status', 'pending');

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: sortBy === 'newest' });

      if (error) console.error(error);
      else setPendingProducts(data || []);
    }

    // Autres onglets (tu peux les compléter plus tard)
    if (activeTab === 'photos') {
      const { data } = await supabase.from('profiles').select('*').or('avatar_status.eq.pending,banner_status.eq.pending');
      setPendingPhotos(data || []);
    }
    if (activeTab === 'reviews') {
      const { data } = await supabase.from('reviews').select('*').eq('status', 'rejected');
      setRefusedReviews(data || []);
    }
    if (activeTab === 'reports') {
      const { data } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
      setReports(data || []);
    }
    if (activeTab === 'messages') {
      const { data } = await supabase.from('admin_messages').select('*').order('created_at', { ascending: false });
      setAdminMessages(data || []);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, refreshKey, searchTerm, sortBy]);

  const approveProduct = async (id: string) => {
    const { error } = await supabase.from('products').update({ status: 'approved' }).eq('id', id);
    if (error) showToast("Erreur", "error");
    else {
      showToast("Produit approuvé ✅");
      setRefreshKey(k => k + 1);
    }
  };

  const rejectProduct = async (id: string) => {
    const { error } = await supabase.from('products').update({ status: 'rejected' }).eq('id', id);
    if (error) showToast("Erreur", "error");
    else {
      showToast("Produit refusé");
      setRefreshKey(k => k + 1);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Administration MyWornSkin</h1>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 mb-8 overflow-x-auto pb-1">
        {[
          { key: 'products', label: 'Produits en attente', icon: ShieldCheck },
          { key: 'photos', label: 'Photos en attente', icon: ImageIcon },
          { key: 'reviews', label: 'Commentaires refusés', icon: AlertTriangle },
          { key: 'messages', label: 'Messages reçus', icon: MessageCircle },
          { key: 'reports', label: 'Signalements', icon: Flag },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.key ? 'border-rose-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <tab.icon size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================== PRODUITS EN ATTENTE ==================== */}
      {activeTab === 'products' && (
        <div>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un titre ou une créatrice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-3xl pl-11 py-3 text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="bg-zinc-900 border border-zinc-700 rounded-3xl px-5 py-3 text-sm"
            >
              <option value="newest">Plus récents d'abord</option>
              <option value="oldest">Plus anciens d'abord</option>
            </select>
          </div>

          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <ShieldCheck className="text-emerald-400" />
            Produits en attente de validation ({pendingProducts.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendingProducts.map((p) => (
              <div key={p.id} className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 flex flex-col">
                {/* Photos publiques */}
                <div className="p-4 pb-2">
                  <p className="text-xs text-zinc-400 mb-2">Photos publiques</p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {p.images?.map((url: string, i: number) => (
                      <img key={i} src={url} alt="" className="h-24 w-24 object-cover rounded-2xl flex-shrink-0" />
                    ))}
                  </div>
                </div>

                {/* Photos de vérification Real Worn */}
                {p.verification_images?.length > 0 && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-emerald-400 flex items-center gap-1 mb-2">
                      <ShieldCheck size={14} /> Photos de vérification Real Worn
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {p.verification_images.map((url: string, i: number) => (
                        <img key={i} src={url} alt="" className="h-24 w-24 object-cover rounded-2xl flex-shrink-0 border border-emerald-500/30" />
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-semibold line-clamp-2 text-lg mb-2">{p.title}</h3>

                  <div className="flex gap-4 text-sm text-zinc-400 mb-3">
                    {p.size && <span>Taille : <strong className="text-white">{p.size}</strong></span>}
                    {p.shoe_size && <span>Pointure : <strong className="text-white">{p.shoe_size}</strong></span>}
                  </div>

                  <p className="text-sm text-zinc-400 line-clamp-3 flex-1">
                    {p.description || p.story || "Aucune description"}
                  </p>

                  <div className="text-3xl font-bold text-rose-400 mt-auto pt-4">
                    {p.price} €
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => approveProduct(p.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3.5 rounded-2xl font-medium flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} /> Approuver
                    </button>
                    <button
                      onClick={() => rejectProduct(p.id)}
                      className="flex-1 bg-red-600 hover:bg-red-500 py-3.5 rounded-2xl font-medium flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} /> Refuser
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pendingProducts.length === 0 && (
            <p className="text-center text-zinc-400 py-20 text-lg">Aucun produit en attente pour le moment.</p>
          )}
        </div>
      )}

      {/* Autres onglets (simples pour le moment) */}
      {activeTab !== 'products' && (
        <div className="text-zinc-400 py-12 text-center">
          Section {activeTab} en cours de développement
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.type === 'success' && <CheckCircle size={22} />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
