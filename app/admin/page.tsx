'use client';

import { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'verifications' | 'conversations' | 'users' | 'photos'>('verifications');

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Dashboard Administrateur</h1>
          <p className="text-zinc-400">Bienvenue, Clemhs</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-zinc-800 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-6 py-3 rounded-t-2xl font-medium whitespace-nowrap transition ${
              activeTab === 'verifications' ? 'bg-rose-600 text-white' : 'hover:bg-zinc-900 text-zinc-400'
            }`}
          >
            Vérifications en attente
          </button>
          <button
            onClick={() => setActiveTab('conversations')}
            className={`px-6 py-3 rounded-t-2xl font-medium whitespace-nowrap transition ${
              activeTab === 'conversations' ? 'bg-rose-600 text-white' : 'hover:bg-zinc-900 text-zinc-400'
            }`}
          >
            Toutes les conversations
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-t-2xl font-medium whitespace-nowrap transition ${
              activeTab === 'users' ? 'bg-rose-600 text-white' : 'hover:bg-zinc-900 text-zinc-400'
            }`}
          >
            Utilisateurs
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-3 rounded-t-2xl font-medium whitespace-nowrap transition ${
              activeTab === 'photos' ? 'bg-rose-600 text-white' : 'hover:bg-zinc-900 text-zinc-400'
            }`}
          >
            Photos du site
          </button>
        </div>

        {/* Contenu */}
        <div className="card p-8 min-h-[700px]">
          {activeTab === 'verifications' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Profils en attente de vérification</h2>
              <p className="text-zinc-400 mb-8">Validez les selfies + pièces d'identité ici.</p>
              {/* On ajoutera la vraie liste demain */}
              <div className="text-center py-20 text-zinc-500">
                Aucune vérification en attente pour le moment.<br />
                (Simulation - on reliera à Supabase demain)
              </div>
            </div>
          )}

          {activeTab === 'conversations' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Toutes les conversations</h2>
              <p className="text-zinc-400">Accès complet à toutes les discussions et photos envoyées.</p>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Liste des utilisateurs</h2>
              <p className="text-zinc-400">Gestion des créateurs et acheteurs.</p>
            </div>
          )}

          {activeTab === 'photos' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Toutes les photos du site</h2>
              <p className="text-zinc-400">Photos des annonces + photos envoyées en messagerie privée.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
