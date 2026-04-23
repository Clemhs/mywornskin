'use client';

// V1 - Page Admin - Validations en attente (avatar & couverture)

import Link from 'next/link';
import { useState } from 'react';

export default function AdminPending() {
  const [pendingItems, setPendingItems] = useState([
    {
      id: 1,
      creator: "Sienna Rose",
      type: "banner",
      oldImage: "https://picsum.photos/id/203/800/320",
      newImage: "https://picsum.photos/id/1005/1200/400",
      date: "il y a 12 min",
    },
    {
      id: 2,
      creator: "Nova Lune",
      type: "avatar",
      oldImage: "https://picsum.photos/id/1012/280/280",
      newImage: "https://picsum.photos/id/160/280/280",
      date: "il y a 47 min",
    },
    {
      id: 3,
      creator: "Lila Noir",
      type: "banner",
      oldImage: "https://picsum.photos/id/1005/800/320",
      newImage: "https://picsum.photos/id/201/1200/400",
      date: "il y a 2h",
    },
  ]);

  const handleApprove = (id: number) => {
    setPendingItems(prev => prev.filter(item => item.id !== id));
    alert(`✅ Changement validé pour l'item ${id}`);
  };

  const handleReject = (id: number) => {
    setPendingItems(prev => prev.filter(item => item.id !== id));
    alert(`❌ Changement refusé pour l'item ${id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Validations en attente</h1>
          <Link href="/" className="text-zinc-400 hover:text-white">← Retour au site</Link>
        </div>

        <p className="text-zinc-400 mb-6">Vous avez {pendingItems.length} demande(s) en attente de validation</p>

        <div className="space-y-6">
          {pendingItems.map((item) => (
            <div key={item.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-lg">{item.creator}</p>
                  <p className="text-rose-400 text-sm">
                    {item.type === "avatar" ? "📸 Changement de photo de profil" : "🖼️ Changement de couverture"}
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">{item.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Image actuelle */}
                <div>
                  <p className="text-xs text-zinc-400 mb-2">Image actuelle</p>
                  <img src={item.oldImage} alt="ancienne" className="w-full rounded-2xl border border-zinc-700" />
                </div>
                {/* Nouvelle image */}
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
          <div className="text-center py-20 text-zinc-400">
            Aucune demande en attente pour le moment 🎉
          </div>
        )}
      </div>
    </div>
  );
}
