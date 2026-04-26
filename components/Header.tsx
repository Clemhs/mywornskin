'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-lg border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="text-3xl">🌹</span>
          <span className="text-2xl font-bold tracking-tighter">MyWornSkin</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/creators" className="hover:text-rose-400 transition-colors">Créatrices</Link>
          <Link href="/shop" className="hover:text-rose-400 transition-colors">Boutique</Link>
          <Link href="/messages" className="hover:text-rose-400 transition-colors">Messages</Link>
        </nav>

        {/* Actions droite */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-3xl text-sm">
            🇫🇷 <span>FR</span>
          </div>
          
          <Link
            href="/become-creator"
            className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 rounded-2xl text-sm font-semibold transition-colors"
          >
            Devenir créatrice
          </Link>
        </div>
      </div>
    </header>
  );
}
