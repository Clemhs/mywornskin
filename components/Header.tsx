'use client';

import { MessageCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-3xl">🌹</span>
          <h1 className="text-2xl font-bold tracking-tighter text-white">MyWornSkin</h1>
        </div>

        {/* Menu + actions */}
        <div className="flex items-center gap-8">
          
          {/* Sélecteur de langue */}
          <div className="flex items-center gap-1 text-sm font-medium bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-700">
            🇫🇷 <span className="text-zinc-300">FR</span>
          </div>

          {/* Icône Messages */}
          <button className="relative p-2 hover:bg-zinc-900 rounded-xl transition-colors">
            <MessageCircle className="w-6 h-6 text-zinc-300" />
            <span className="absolute -top-1 -right-1 bg-rose-500 text-[10px] w-4 h-4 flex items-center justify-center rounded-full">3</span>
          </button>

          {/* Bouton Devenir créatrice dans le header */}
          <button
            onClick={() => window.location.href = '/become-creator'}
            className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-2xl transition-all"
          >
            Devenir créatrice
          </button>
        </div>
      </div>
    </header>
  );
}
