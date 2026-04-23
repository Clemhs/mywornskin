'use client';

import { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'conversations' | 'photos' | 'verifications'>('verifications');

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Dashboard Administrateur</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-zinc-800">
          {['verifications', 'users', 'conversations', 'photos'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-t-2xl font-medium transition ${
                activeTab === tab 
                  ? 'bg-rose-600 text-white' 
                  : 'hover:bg-zinc-900 text-zinc-400'
              }`}
            >
              {tab === 'verifications' && 'Vérifications'}
              {tab === 'users' && 'Utilisateurs'}
              {tab === 'conversations' && 'Conversations'}
              {tab === 'photos' && 'Photos'}
            </button>
          ))}
        </div>

        {/* Contenu selon l'onglet */}
        <div className="card p-8 min-h-[600px]">
          {activeTab === 'verifications' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Profils en attente de vérification</h2>
              <p className="text-zinc-400">Ici tu pourras valider les selfies + cartes d'identité.</p>
              {/* On remplira ça demain avec les vraies données */}
            </div>
          )}

          {activeTab === 'conversations' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Toutes les conversations</h2>
              <p className="text-zinc-400">Tu pourras voir toutes les discussions et photos envoyées en privé.</p>
            </div>
          )}

          {activeTab === 'photos' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Toutes les photos du site</h2>
              <p className="text-zinc-400">Photos des annonces + photos envoyées en messagerie.</p>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Liste des utilisateurs</h2>
              <p className="text-zinc-400">Gestion des créateurs et acheteurs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
