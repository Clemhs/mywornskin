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
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section - Style MyM / OnlyFans */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Fond sombre avec texture subtile */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
        
        {/* Effet de lumière douce */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#4b2e5e22_0%,transparent_70%)]"></div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="mb-8">
            <span className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm tracking-widest mb-6">
              INTIME • PORTÉ • EXCLUSIF
            </span>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold tracking-tighter mb-6 leading-none">
            MyWornSkin
          </h1>

          <p className="text-2xl md:text-3xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12">
            Des vêtements qui ont vécu.<br />
            Des désirs qui se partagent.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            {user ? (
              <>
                {hasSubscription ? (
                  <Link 
                    href="/exclusive"
                    className="group bg-white text-black font-semibold py-5 px-14 rounded-3xl text-xl hover:bg-gray-100 transition-all active:scale-95 flex items-center gap-3"
                  >
                    Accéder à l'exclusif 
                    <span className="group-hover:rotate-12 transition">💋</span>
                  </Link>
                ) : (
                  <Link 
                    href="/subscribe"
                    className="bg-white text-black font-semibold py-5 px-14 rounded-3xl text-xl hover:bg-gray-100 transition-all active:scale-95"
                  >
                    S'abonner
                  </Link>
                )}

                <Link 
                  href="/messages"
                  className="border border-white/60 hover:border-white font-semibold py-5 px-14 rounded-3xl text-xl transition-all active:scale-95"
                >
                  Messagerie privée
                </Link>
              </>
            ) : (
              <Link 
                href="/auth"
                className="bg-white text-black font-semibold py-5 px-14 rounded-3xl text-xl hover:bg-gray-100 transition-all active:scale-95"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-xs tracking-widest text-gray-500 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-500 to-transparent"></div>
          DÉCOUVRIR
        </div>
      </div>

      {/* Section Vente */}
      <div className="py-28 px-6 text-center border-t border-white/10 bg-zinc-950">
        <h2 className="text-5xl font-bold mb-6">Tu veux vendre tes pièces ?</h2>
        <p className="text-xl text-gray-400 max-w-lg mx-auto mb-12">
          Partage l’intimité de tes vêtements déjà portés et transforme ton quotidien en revenu.
        </p>
        <Link 
          href="/sell"
          className="inline-block border border-white/70 hover:border-white px-16 py-6 rounded-3xl text-xl font-medium transition-all active:scale-95"
        >
          Mettre mes vêtements en vente →
        </Link>
      </div>
    </div>
  );
}
