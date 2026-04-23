'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminPending() {
  const [pendingItems, setPendingItems] = useState([
    { id: 1, creatorId: 3, creator: "Sienna Rose", type: "banner", oldImage: "https://picsum.photos/id/203/800/320", newImage: "https://picsum.photos/id/1005/1200/400", date: "il y a 12 min" },
    { id: 2, creatorId: 4, creator: "Nova Lune", type: "avatar", oldImage: "https://picsum.photos/id/1012/280/280", newImage: "https://picsum.photos/id/160/280/280", date: "il y a 47 min" },
  ]);

  const [toast, setToast] = useState(null);

  const handleApprove = (id) => {
    setPendingItems(prev => prev.filter(item => item.id !== id));
    setToast({ message: '✅ Validé', type: 'success' });
    setTimeout(() => setToast(null), 2500);
  };

  const handleReject = (id) => {
    setPendingItems(prev => prev.filter(item => item.id !== id));
    setToast({ message: '❌ Refusé', type: 'error' });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-2">Validations en attente</h1>
        <p className="text-zinc-400 mb-8">Vous avez {pendingItems.length} demande(s)</p>

        {toast && (
          <div className={`fixed top-6 right-6 px-8 py-4 rounded-2xl text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast.message}
          </div>
        )}

        <div className="space-y-6">
          {pendingItems.map(item => (
            <div key={item.id} className="card p-6">
              <div className="flex justify-between">
                <Link href={`/creators/${item.creatorId}`} className="font-semibold text-lg hover:text-rose-400">
                  {item.creator}
                </Link>
                <span className="text-xs text-zinc-500">{item.date}</span>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <p className="text-xs text-zinc-400 mb-2">Actuelle</p>
                  <img src={item.oldImage} className="rounded-2xl" />
                </div>
                <div>
                  <p className="text-xs text-rose-400 mb-2">Proposée</p>
                  <img src={item.newImage} className="rounded-2xl border-2 border-rose-400" />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={() => handleApprove(item.id)} className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl">✅ Valider</button>
                <button onClick={() => handleReject(item.id)} className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl">❌ Refuser</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
