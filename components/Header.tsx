'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

export default function Header() {
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth();
  const supabase = createClient();

  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // Messages non lus
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const fetchUnread = async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false);
      setUnreadCount(count || 0);
    };

    fetchUnread();

    const channel = supabase
      .channel('unread-messages')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'messages', 
          filter: `receiver_id=eq.${user.id}` 
        }, 
        fetchUnread
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Panier
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  // Fermer menu quand on change de page
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold tracking-tighter">
          MyWornSkin
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
          <Link href="/shop" className="hover:text-rose-400 transition-colors">Boutique</Link>
          <Link href="/creators" className="hover:text-rose-400 transition-colors">Créatrices</Link>
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn && user ? (
            <>
              <Link href="/messages" className="relative p-3 hover:bg-zinc-900 rounded-2xl transition-all">
                <MessageCircle className="w-5 h-5" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                )}
              </Link>

              <Link href="/cart" className="relative p-3 hover:bg-zinc-900 rounded-2xl transition-all">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {cartCount}
                  </div>
                )}
              </Link>

              <div className="relative">
                <button 
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-9 h-9 rounded-2xl overflow-hidden border border-zinc-700 hover:border-rose-400 transition-all"
                >
                  <img 
                    src={user.user_metadata?.avatar_url || "https://picsum.photos/id/64/128/128"} 
                    alt="Profil" 
                    className="w-full h-full object-cover"
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-3xl py-2 shadow-2xl z-50">
                    <Link href="/creators/me" className="block px-6 py-3 hover:bg-zinc-800" onClick={() => setMenuOpen(false)}>👤 Mon Profil</Link>
                    <Link href="/creators/me/edit" className="block px-6 py-3 hover:bg-zinc-800" onClick={() => setMenuOpen(false)}>✏️ Éditer mon profil</Link>
                    <Link href="/messages" className="block px-6 py-3 hover:bg-zinc-800" onClick={() => setMenuOpen(false)}>💬 Messages</Link>
                    <button onClick={handleLogout} className="w-full text-left px-6 py-3 text-red-400 hover:bg-zinc-800">Se déconnecter</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href="/login" className="px-6 py-2.5 border border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-black rounded-2xl text-sm font-semibold transition-all">
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
