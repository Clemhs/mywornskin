'use client';

// V3 - Admin Pending - Liens cliquables vers profil créateur

import Link from 'next/link';
import { useState } from 'react';

export default function AdminPending() {
  const [pendingItems, setPendingItems] = useState([
    { 
      id: 1, 
      creatorId: 3, 
      creator: "Sienna Rose", 
      type: "banner", 
      oldImage: "https://picsum.photos/id/203/800/320", 
      newImage: "https://picsum.photos/id/1005/1200/400", 
      date: "il y a 12 min" 
    },
    { 
      id: 2, 
      creatorId: 4, 
      creator: "Nova Lune", 
      type: "avatar", 
      oldImage: "https://picsum.photos/id/1012/280/280", 
      newImage: "https://picsum.photos/id/160/280/280", 
      date: "il y a 47 min" 
    },
    { 
      id: 3, 
      creatorId: 1, 
      creator: "Lila Noir", 
      type: "banner", 
      oldImage: "https://picsum.photos/id/1005/800/320", 
      newImage: "https://picsum.photos/id/201/1200/400", 
      date: "il y a 2h" 
    },
  ]);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };

  const handleApprove = (id: number) => {
    setPendingItems(prev => prev.filter(item => item.id !== id));
    showToast('✅ Changement validé avec succès', 'success');
  };

  const handleReject = (id: number) => {
    setPendingItems(prev => prev.filter(item => item.id !== id));
    showToast('❌ Changement refusé', 'error');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Validations en attente</h1>
          <Link href="/" className="text-zinc-400 hover:text-white">← Retour au site</Link>
        </div>

        <p className="text-zinc-400 mb-8">Vous avez {pendingItems.length} demande(s) en attente</p>

        {toast && (
          <div className={`fixed top-6 right-6 px-8 py-4 rounded-2xl text-white shadow-2xl z-50 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast.message}
          </div>
        )}

        <div className="space-y-6">
          {pendingItems.map((item) => (
            <div key={item.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <Link 
                  href={`/creators/${item.creatorId}`}
                  className="font-semibold text-lg hover:text-rose-400 transition-colors"
                >
                  {item.creator}
                </Link>
                <span className="text-xs text-zinc-500">{item.date}</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-zinc-400 mb-2">Image actuelle</p>
                  <img src={item.oldImage} alt="ancienne" className="w-full rounded-2xl border border-zinc-700" />
                </div>
                <div>
                  <p className="text-xs text-rose-400 mb-2">Nouvelle image proposée</p>
                  <img src={item.newImage} alt="nouvelle" className="w-full rounded-2xl border-2 border-rose-400" />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => handleApprove(item.id)}
                  className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-medium transition"
                >
                  ✅ Valider
                </button>
                <button 
                  onClick={() => handleReject(item.id)}
                  className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-medium transition"
                >
                  ❌ Refuser
                </button>
              </div>
            </div>
          ))}
        </div>

        {pendingItems.length === 0 && (
          <div className="text-center py-20 text-zinc-400 text-lg">
            Aucune demande en attente pour le moment 🎉
          </div>
        )}
      </div>
    </div>
  );
}
