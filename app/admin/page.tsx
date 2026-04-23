'use client';

import { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'verifications' | 'conversations' | 'users' | 'sales'>('verifications');

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Dashboard Administrateur</h1>

        <div className="flex gap-2 mb-10 border-b border-zinc-800 overflow-x-auto">
          <button onClick={() => setActiveTab('verifications')} className={`px-6 py-3 rounded-t-2xl whitespace-nowrap ${activeTab === 'verifications' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:bg-zinc-900'}`}>
            Vérifications
          </button>
          <button onClick={() => setActiveTab('conversations')} className={`px-6 py-3 rounded-t-2xl whitespace-nowrap ${activeTab === 'conversations' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:bg-zinc-900'}`}>
            Conversations
          </button>
          <button onClick={() => setActiveTab('users')} className={`px-6 py-3 rounded-t-2xl whitespace-nowrap ${activeTab === 'users' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:bg-zinc-900'}`}>
            Utilisateurs
          </button>
          <button onClick={() => setActiveTab('sales')} className={`px-6 py-3 rounded-t-2xl whitespace-nowrap ${activeTab === 'sales' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:bg-zinc-900'}`}>
            Ventes &amp; Statistiques
          </button>
        </div>

        <div className="card p-10">
          {activeTab === 'verifications' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Profils en attente de vérification</h2>
              <p className="text-emerald-400">Ici tu pourras valider les selfies + pièces d'identité.</p>
            </div>
          )}

          {activeTab === 'conversations' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Toutes les conversations</h2>
              <p className="text-zinc-400">Accès complet aux messages et photos envoyées.</p>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Gestion des utilisateurs</h2>
              <p className="text-zinc-400">Liste complète des créateurs et acheteurs.</p>
            </div>
          )}

          {activeTab === 'sales' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Statistiques des ventes</h2>
              <p className="text-zinc-400">Chiffre d'affaires, commissions, etc.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
