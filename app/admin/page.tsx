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

  // Products
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<string>(''); // Filtre par créatrice
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const [loading, setLoading] = useState(false);

  // Modal image
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };

  const loadProducts = async () => {
    setLoading(true);

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

    if (selectedCreator) {
      query = query.eq('creator_id', selectedCreator);
    }

    const { data, error } = await query
      .order('created_at', { ascending: sortBy === 'newest' });

    if (error) console.error(error);
    else setPendingProducts(data || []);

    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts();
    }
  }, [activeTab, searchTerm, selectedCreator, sortBy]);

  // Récupérer la liste unique des créatrices pour le filtre
  const creators = useMemo(() => {
    const unique = new Map();
    pendingProducts.forEach(p => {
      if (p.profiles) {
        unique.set(p.creator_id, p.profiles);
      }
    });
    return Array.from(unique.values());
  }, [pendingProducts]);

  const approveProduct = async (id: string) => {
    const { error } = await supabase.from('products').update({ status: 'approved' }).eq('id', id);
    if (error) showToast("Erreur", "error");
    else {
      showToast("Produit approuvé ✅");
      loadProducts();
    }
  };

  const rejectProduct = async (id: string) => {
    const { error } = await supabase.from('products').update({ status: 'rejected' }).eq('id', id);
    if (error) showToast("Erreur", "error");
    else {
      showToast("Produit refusé");
      loadProducts();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Administration MyWornSkin</h1>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 mb-8 overflow-x-auto">
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
            className={`flex items-center gap-2 px-6 py-4 border-b-2 whitespace-nowrap transition-all ${
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
            {/* Recherche */}
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

            {/* Filtre par créatrice */}
            <select
              value={selectedCreator}
              onChange={(e) => setSelectedCreator(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded-3xl px-5 py-3 text-sm min-w-[220px]"
            >
              <option value="">Toutes les créatrices</option>
              {creators.map((c: any) => (
                <option key={c.id} value={c.id}>
                  @{c.username} - {c.full_name}
                </option>
              ))}
            </select>

            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="bg-zinc-900 border border-zinc-700 rounded-3xl px-5 py-3 text-sm"
            >
              <option value="newest">Plus récents</option>
              <option value="oldest">Plus anciens</option>
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
                <div className="p-4">
                  <p className="text-xs text-zinc-400 mb-2">Photos publiques</p>
                  <div className="flex gap-2 overflow-x-auto pb-3">
                    {p.images?.map((url: string, i: number) => (
                      <img
                        key={i}
                        src={url}
                        alt="public"
                        className="h-28 w-28 object-cover rounded-2xl cursor-pointer flex-shrink-0 hover:scale-105 transition"
                        onClick={() => setSelectedImage(url)}
                      />
                    ))}
                  </div>
                </div>

                {/* Photos Real Worn */}
                {p.verification_images?.length > 0 && (
                  <div className="px-4 pb-3">
                    <p className="text-xs text-emerald-400 flex items-center gap-1 mb-2">
                      <ShieldCheck size={14} /> Vérification Real Worn
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-3">
                      {p.verification_images.map((url: string, i: number) => (
                        <img
                          key={i}
                          src={url}
                          alt="verif"
                          className="h-28 w-28 object-cover rounded-2xl border border-emerald-500/30 cursor-pointer flex-shrink-0"
                          onClick={() => setSelectedImage(url)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col">
                  <Link 
                    href={`/creators/${p.profiles?.username}`} 
                    className="text-rose-400 hover:underline text-sm mb-1"
                  >
                    @{p.profiles?.username || 'inconnu'}
                  </Link>

                  <h3 className="font-semibold line-clamp-2 text-lg mb-2">{p.title}</h3>

                  <div className="flex gap-4 text-sm text-zinc-400 mb-3">
                    {p.size && <span>Taille : <strong>{p.size}</strong></span>}
                    {p.shoe_size && <span>Pointure : <strong>{p.shoe_size}</strong></span>}
                  </div>

                  <p className="text-sm text-zinc-400 line-clamp-4 flex-1">
                    {p.description || p.story || "Aucune description"}
                  </p>

                  <div className="text-3xl font-bold text-rose-400 mt-4">
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

          {pendingProducts.length === 0 && !loading && (
            <p className="text-center text-zinc-400 py-20 text-lg">Aucun produit en attente.</p>
          )}
        </div>
      )}

      {/* Modal d'agrandissement d'image */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4" 
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img src={selectedImage} alt="Agrandie" className="max-h-[90vh] rounded-3xl shadow-2xl" />
            <button 
              onClick={() => setSelectedImage(null)} 
              className="absolute -top-4 -right-4 bg-zinc-900 hover:bg-red-600 text-white p-4 rounded-full text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
