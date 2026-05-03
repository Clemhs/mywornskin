'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LogOut, Plus, MessageCircle, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // À remplacer par ton AuthContext plus tard
  const [isCreator, setIsCreator] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Simulation pour l'instant
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  }, []);

  const handleLogout = () => {
    // À implémenter avec Supabase plus tard
    setIsLoggedIn(false);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <Link href="/" className="text-3xl font-bold tracking-tighter">
          MyWornSkin
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
          <Link href="/shop" className="hover:text-rose-400 transition-colors">Boutique</Link>
          <Link href="/creators" className="hover:text-rose-400 transition-colors">Créatrices</Link>
          <Link href="/messages" className="hover:text-rose-400 transition-colors">Messages</Link>
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {isCreator && (
                <Link href="/sell" className="hidden md:flex items-center gap-2 bg-rose-600 hover:bg-rose-500 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all">
                  <Plus className="w-4 h-4" /> Nouvelle pièce
                </Link>
              )}

              <Link href="/cart" className="relative p-3 hover:bg-zinc-900 rounded-2xl transition-all">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-rose-500 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </div>
                )}
              </Link>

              <Link href="/messages" className="p-3 hover:bg-zinc-900 rounded-2xl transition-all">
                <MessageCircle className="w-5 h-5" />
              </Link>

              <div className="relative">
                <button 
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-9 h-9 rounded-2xl overflow-hidden border border-zinc-700 hover:border-rose-400 transition-all"
                >
                  <User className="w-5 h-5 m-auto text-zinc-400" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-3xl py-1 shadow-2xl z-[100]">
                    <Link href="/profile" className="block px-6 py-3 hover:bg-zinc-800">👤 Mon Profil</Link>
                    {isCreator && (
                      <Link href="/creators/me/edit" className="block px-6 py-3 hover:bg-zinc-800">✏️ Éditer mon profil</Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-6 py-3 text-red-400 hover:bg-zinc-800">Se déconnecter</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link 
              href="/login"
              className="px-6 py-2.5 border border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-black rounded-2xl text-sm font-semibold transition-all"
            >
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
