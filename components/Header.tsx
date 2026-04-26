'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter">MyWornSkin</Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/creators" className="hover:text-rose-400">Créatrices</Link>
          <Link href="/shop" className="hover:text-rose-400">Boutique</Link>
        </nav>
      </div>
    </header>
  );
}
