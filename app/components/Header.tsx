'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-light tracking-tighter">MyWornSkin</span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/creators" className="hover:text-rose-400 transition-colors">Créatrices</Link>
          <Link href="/sell" className="hover:text-rose-400 transition-colors">Vendre</Link>
          <Link href="/messages" className="hover:text-rose-400 transition-colors">Messages</Link>
          <Link href="/why-join" className="hover:text-rose-400 transition-colors">Pourquoi nous rejoindre ?</Link>
        </nav>

        {/* Droite : Langues + Messages */}
        <div className="flex items-center gap-3">
          
          {/* Sélecteur langue (version simplifiée pour l'instant) */}
          <div className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-3xl text-sm transition-colors cursor-pointer">
            <span className="text-base">🇫🇷</span>
            <span className="font-medium">FR</span>
          </div>

          {/* Icône Messages */}
          <Link
            href="/messages"
            className="w-9 h-9 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 rounded-2xl transition-colors text-xl"
          >
            💬
          </Link>
        </div>
      </div>
    </header>
  );
}
