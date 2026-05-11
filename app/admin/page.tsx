'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Image as ImageIcon, MessageCircle, Flag, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminPage() {
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'products' | 'photos' | 'reviews' | 'reports'>('products');
  const [refreshKey, setRefreshKey] = useState(0);

  // Produits
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);

  // Photos
  const [pendingPhotos, setPendingPhotos] = useState<any[]>([]);

  // Reviews / Commentaires
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);

  // Signalements
  const [reports, setReports] = useState<any[]>([]);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };

  const loadData = async () => {
    // ==================== PRODUITS ====================
    if (activeTab === 'products') {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, title, description, price_1day, images, status, created_at, creator_id
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) console.error("Erreur produits:", error);
      else setPendingProducts(data || []);
    }

    // ==================== PHOTOS ====================
    if (activeTab === 'photos') {
      const { data } = await supabase
        .from('profiles')
        .select(`
          id, username, full_name, avatar_url, banner_url,
          avatar_pending_url, banner_pending_url,
          avatar_status, banner_status
        `)
        .or('avatar_status.eq.pending,banner_status.eq.pending');
      setPendingPhotos(data || []);
    }

    // ==================== REVIEWS ====================
    if (activeTab === 'reviews') {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      setPendingReviews(data || []);
    }

    // ==================== SIGNALEMENTS ====================
    if (activeTab === 'reports') {
      const { data } = await supabase
        .from('reports')
        .select(`
          *,
          profiles!reports_creator_id_fkey (username, full_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      setReports(data || []);
      setPendingReportsCount(data?.length || 0);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, refreshKey]);

  // Actions Produits
  const approveProduct = async (id: string) => {
    const { error } = await supabase.from('products').update({ status: 'approved' }).eq('id', id);
    if (error) showToast("Erreur approbation", "error");
    else {
      showToast("✅ Produit approuvé");
      setRefreshKey(k => k + 1);
    }
  };

  const rejectProduct = async (id: string) => {
    const { error } = await supabase.from('products').update({ status: 'rejected' }).eq('id', id);
    if (error) showToast("Erreur refus", "error");
    else {
      showToast("❌ Produit refusé");
      setRefreshKey(k => k + 1);
    }
  };

  // Actions existantes (à compléter si besoin)
  const handlePhotoAction = async (profileId: string, type: 'avatar' | 'banner', status: 'approved' | 'rejected') => {
    // Ton code original ici
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Administration MyWornSkin</h1>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 mb-8 overflow-x-auto pb-1">
          {[
            { id: 'products', label: `Produits en attente (${pendingProducts.length})`, icon: ShieldCheck },
            { id: 'photos', label: 'Photos en attente', icon: ImageIcon },
            { id: 'reviews', label: 'Commentaires', icon: MessageCircle },
            { id: 'reports', label: `Signalements ${pendingReportsCount > 0 ? `(${pendingReportsCount})` : ''}`, icon: Flag },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-4 border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'border-rose-500 text-white' : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ====================== PRODUITS EN ATTENTE ====================== */}
        {activeTab === 'products' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              Produits en attente de validation
            </h2>

            {pendingProducts.length === 0 ? (
              <div className="text-center py-20 text-zinc-400">
                Aucun produit en attente pour le moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingProducts.map((p) => (
                  <div key={p.id} className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
                    <div className="flex gap-5">
                      {p.images?.[0] && <img src={p.images[0]} className="w-28 h-28 object-cover rounded-2xl" />}
                      <div className="flex-1">
                        <h3 className="font-semibold">{p.title}</h3>
                        <p className="text-sm text-zinc-500 mt-1">Créateur ID : {p.creator_id}</p>
                        <p className="text-sm text-zinc-400 mt-3 line-clamp-3">{p.description}</p>
                        <p className="mt-4 text-rose-400 font-medium">{p.price_1day} €</p>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button onClick={() => approveProduct(p.id)} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-medium flex items-center justify-center gap-2">
                        <CheckCircle size={18} /> Approuver
                      </button>
                      <button onClick={() => rejectProduct(p.id)} className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-2xl font-medium flex items-center justify-center gap-2">
                        <XCircle size={18} /> Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
