'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        setHasSubscription(!!data);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section - plus sensuelle */}
      <div className="relative h-screen flex items-center justify-center bg-[radial-gradient(at_center,#1a1a1a_0%,#000_70%)]">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/id/1015/2000/1200')] opacity-20 bg-cover"></div>
        
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-7xl md:text-8xl font-bold tracking-tighter mb-6">
            MyWornSkin
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-12 leading-relaxed">
            L'intimité portée sur soi.<br />
            Vêtements déjà vécus. Désirs partagés.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                {hasSubscription ? (
                  <Link 
                    href="/exclusive"
                    className="bg-white text-black font-bold py-5 px-12 rounded-3xl text-xl hover:bg-gray-200 transition-all active:scale-95"
                  >
                    Accéder à l'exclusif
                  </Link>
                ) : (
                  <Link 
                    href="/subscribe"
                    className="bg-white text-black font-bold py-5 px-12 rounded-3xl text-xl hover:bg-gray-200 transition-all active:scale-95"
                  >
                    S'abonner
                  </Link>
                )}
                <Link 
                  href="/messages"
                  className="border border-white/70 hover:border-white font-bold py-5 px-12 rounded-3xl text-xl transition-all active:scale-95"
                >
                  Messagerie
                </Link>
              </>
            ) : (
              <Link 
                href="/auth"
                className="bg-white text-black font-bold py-5 px-12 rounded-3xl text-xl hover:bg-gray-200 transition-all active:scale-95"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>

        <div className="absolute bottom-10 text-xs text-gray-500 tracking-widest">
          SCROLL POUR DÉCOUVRIR
        </div>
      </div>

      {/* Section Vente */}
      <div className="py-24 px-6 text-center border-t border-white/10">
        <h2 className="text-4xl font-bold mb-6">Tu veux vendre tes pièces portées ?</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-10">
          Partage ton intimité et gagne de l'argent avec tes vêtements déjà vécus.
        </p>
        <Link 
          href="/sell"
          className="inline-block border border-white/60 hover:border-white px-14 py-5 rounded-3xl text-lg transition-all active:scale-95"
        >
          Mettre en vente mes vêtements →
        </Link>
      </div>

      <div className="h-24"></div>
    </div>
  );
}
