'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const supabase = createClient();

  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string>('/default-avatar.png');
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      // Photo de profil
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);

      // Détection créateur plus robuste
      const { data: creatorCheck } = await supabase
        .from('creators')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      setIsCreator(!!creatorCheck);
    };

    fetchUserData();

    // Messages non lus
    const fetchUnread = async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .is('is_read', false);

      setUnreadCount(count || 0);
    };

    fetchUnread();

  }, [user]);

  const handleLogout = async () => {
    await logout();
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
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/messages" className="relative p-3 hover:bg-zinc-900 rounded-2xl transition-all">
                <MessageCircle className="w-6 h-6" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                )}
              </Link>

              <Link href="/cart" className="p-3 hover:bg-zinc-900 rounded-2xl transition-all">
                <ShoppingCart className="w-6 h-6" />
              </Link>

              {/* Menu Profil */}
              <div className="relative">
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
                      href={isCreator ? "/creators/me" : "/profile"} 
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
            <Link href="/login" className="px-6 py-2.5 border border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-black rounded-2xl text-sm font-semibold transition-all">
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
