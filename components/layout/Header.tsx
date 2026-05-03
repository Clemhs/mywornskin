'use client';

import Link from 'next/link';
import { ShoppingBag, User, Heart, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">M</span>
          </div>
          <span className="text-2xl font-semibold tracking-tight">MyWornSkin</span>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm">
          <Link href="/shop" className="hover:text-rose-400 transition-colors">Boutique</Link>
          <Link href="/creatrices" className="hover:text-rose-400 transition-colors">Créatrices</Link>
        </nav>

        <div className="flex items-center gap-6">
          <button className="hover:text-rose-400">
            <Heart className="w-5 h-5" />
          </button>
          <Link href="/cart" className="hover:text-rose-400">
            <ShoppingBag className="w-5 h-5" />
          </Link>
          <Link href="/profile" className="hover:text-rose-400">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
