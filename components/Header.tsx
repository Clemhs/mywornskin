'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Plus, MessageCircle, ShoppingCart, Heart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isCreator, logout, isLoggedIn, profile } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Avatar mis à jour directement depuis le profile (plus fiable)
  const avatarUrl = profile?.avatar_url || '/default-avatar.png';

  // Click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      console.error("Erreur logout:", err);
      window.location.href = '/login';
    }
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
          {isLoggedIn && user ? (
            <>
              <Link href="/messages" className="relative p-2 hover:bg-zinc-900 rounded-xl transition-colors">
                <MessageCircle className="w-5 h-5" />
              </Link>

              <Link href="/profile/favorites" className="p-2 hover:bg-zinc-900 rounded-xl transition-colors">
                <Heart className="w-5 h-5" />
              </Link>

              {isCreator ? (
                <Link 
                  href="/sell"
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-2xl font-medium transition-all"
                >
                  <Plus size={18} />
                  Nouvelle pièce
                </Link>
              ) : (
                <Link href="/cart" className="relative p-2 hover:bg-zinc-900 rounded-xl transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                </Link>
              )}

              {/* Menu Profil */}
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-9 h-9 rounded-2xl overflow-hidden border border-zinc-700 hover:border-rose-400 transition-all"
                >
                  <img 
                    src={avatarUrl} 
                    alt="Profil" 
                    className="w-full h-full object-cover"
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-3xl py-2 shadow-2xl z-50">
                    <Link 
                      href={isCreator ? `/creators/${user.user_metadata?.username || 'me'}` : "/profile"} 
                      className="block px-6 py-3 hover:bg-zinc-800"
                      onClick={() => setMenuOpen(false)}
                    >
                      👤 Mon Profil
                    </Link>

                    {isCreator && (
                      <Link 
                        href="/creators/me/edit" 
                        className="block px-6 py-3 hover:bg-zinc-800"
                        onClick={() => setMenuOpen(false)}
                      >
                        ✏️ Éditer mon profil
                      </Link>
                    )}

                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-6 py-3 text-red-400 hover:bg-zinc-800"
                    >
                      Se déconnecter
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
