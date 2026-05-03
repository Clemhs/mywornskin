'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LogOut, Plus, MessageCircle, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const { user, isLoggedIn, logout, loading } = useAuth();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  const username = user?.user_metadata?.username || '';
  const isCreator = username.toLowerCase().includes('creator') || false;
  const profileSlug = username ? username.replace(/\s+/g, '') : 'me';

  // Ferme le menu quand on change de page
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (loading) {
    return <header className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800 h-20" />;
  }

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
          {isLoggedIn && user ? (
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
                  className="w-9 h-9 rounded-2xl overflow-hidden border border-zinc-700 hover:border-rose-400 transition-all flex items-center justify-center bg-zinc-900"
                >
                  <User className="w-5 h-5 text-zinc-400" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-3xl py-2 shadow-2xl z-[100]">
                    <div className="px-6 py-3 border-b border-zinc-700">
                      <p className="font-medium">{username || 'Utilisateur'}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                    
                    <Link 
                      href={`/creators/${profileSlug}`} 
                      className="block px-6 py-3 hover:bg-zinc-800"
                      onClick={() => setMenuOpen(false)}
                    >
                      👤 Mon Profil {isCreator ? 'Créatrice' : ''}
                    </Link>
                    
                    {isCreator ? (
                      <Link 
                        href="/creators/me/edit" 
                        className="block px-6 py-3 hover:bg-zinc-800"
                        onClick={() => setMenuOpen(false)}
                      >
                        ✏️ Éditer mon profil
                      </Link>
                    ) : (
                      <Link 
                        href="/profile/edit" 
                        className="block px-6 py-3 hover:bg-zinc-800"
                        onClick={() => setMenuOpen(false)}
                      >
                        ✏️ Éditer mon profil
                      </Link>
                    )}
                    
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-6 py-3 text-red-400 hover:bg-zinc-800 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Se déconnecter
                    </button>
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
