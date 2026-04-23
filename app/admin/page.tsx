'use client';

import { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'verifications' | 'conversations' | 'users'>('verifications');

  // Données simulées (on reliera à Supabase plus tard)
  const pendingVerifications = [
    { id: 1, username: "SatinSecret", date: "22/04/2026", status: "En attente" },
    { id: 2, username: "LaceLover", date: "21/04/2026", status: "En attente" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Dashboard Administrateur</h1>

        <div className="flex gap-2 mb-8 border-b border-zinc-800">
          <button onClick={() => setActiveTab('verifications')} className={`px-6 py-3 rounded-t-2xl ${activeTab === 'verifications' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:bg-zinc-900'}`}>
            Vérifications ({pendingVerifications.length})
          </button>
          <button onClick={() => setActiveTab('conversations')} className={`px-6 py-3 rounded-t-2xl ${activeTab === 'conversations' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:bg-zinc-900'}`}>
            Conversations
          </button>
          <button onClick={() => setActiveTab('users')} className={`px-6 py-3 rounded-t-2xl ${activeTab === 'users' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:bg-zinc-900'}`}>
            Utilisateurs
          </button>
        </div>

        {activeTab === 'verifications' && (
          <div className="card p-8">
            <h2 className="text-2xl font-semibold mb-6">Profils en attente de vérification</h2>
            {pendingVerifications.map((user) => (
              <div key={user.id} className="flex justify-between items-center border-b border-zinc-800 py-6 last:border-none">
                <div>
                  <p className="font-medium">@{user.username}</p>
                  <p className="text-sm text-zinc-500">Demande du {user.date}</p>
                </div>
                <div className="flex gap-4">
                  <button className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-2xl text-sm">Refuser</button>
                  <button className="bg-emerald-600 hover:bg-emerald-500 px-5 py-2 rounded-2xl text-sm">Valider le profil</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'conversations' && (
          <div className="card p-8">
            <h2 className="text-2xl font-semibold mb-6">Toutes les conversations</h2>
            <p className="text-zinc-400">Ici tu pourras voir toutes les discussions et photos envoyées.</p>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card p-8">
            <h2 className="text-2xl font-semibold mb-6">Liste des utilisateurs</h2>
            <p className="text-zinc-400">Gestion complète des créateurs et acheteurs.</p>
          </div>
        )}
      </div>
    </div>
  );
}
