'use client';

import { useState, useEffect, useRef } from 'react';
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

  const heroRef = useRef<HTMLDivElement>(null);

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

    // Parallax subtil sur le hero
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section - Ultra sensuel */}
      <div ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background avec effet de profondeur */}
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#3a1f4a_0%,#0a0a0a_60%)]"></div>
        
        {/* Effet de lumière douce */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent"></div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <div className="mb-6 inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-8 py-3 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            <span className="text-sm tracking-[3px] uppercase">Intime • Porté • Désiré</span>
          </div>

          <h1 className="text-[92px] md:text-[120px] font-bold tracking-[-4px] leading-none mb-6">
            MyWornSkin
          </h1>

          <p className="text-2xl md:text-3xl text-gray-300 max-w-2xl mx-auto mb-16 leading-relaxed">
            Des vêtements qui ont une histoire.<br />
            Des corps qui se racontent.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {user ? (
              <>
                {hasSubscription ? (
                  <Link 
                    href="/exclusive"
                    className="group relative bg-white text-black font-semibold py-6 px-16 rounded-3xl text-2xl overflow-hidden hover:scale-105 transition-all duration-300"
                  >
                    <span className="relative z-10">Accéder à l'exclusif</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </Link>
                ) : (
                  <Link 
                    href="/subscribe"
                    className="group relative bg-white text-black font-semibold py-6 px-16 rounded-3xl text-2xl overflow-hidden hover:scale-105 transition-all duration-300"
                  >
                    S'abonner
                  </Link>
                )}

                <Link 
                  href="/messages"
                  className="border border-white/60 hover:border-white font-semibold py-6 px-16 rounded-3xl text-2xl transition-all hover:bg-white/5"
                >
                  Messagerie privée
                </Link>
              </>
            ) : (
              <Link 
                href="/auth"
                className="group relative bg-white text-black font-semibold py-6 px-16 rounded-3xl text-2xl overflow-hidden hover:scale-105 transition-all duration-300"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-xs tracking-widest text-gray-400">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-400 to-transparent"></div>
          SCROLL
        </div>
      </div>

      {/* Section Vente */}
      <div className="py-28 px-6 border-t border-white/10 bg-zinc-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8">Tu veux vendre tes pièces portées ?</h2>
          <p className="text-xl text-gray-400 mb-12">
            Transforme ton intimité en revenu. Partage tes vêtements déjà vécus avec des amateurs qui les désirent.
          </p>
          <Link 
            href="/sell"
            className="inline-block border-2 border-white/70 hover:border-white px-20 py-7 rounded-3xl text-2xl font-medium transition-all hover:bg-white hover:text-black"
          >
            Commencer à vendre →
          </Link>
        </div>
      </div>
    </div>
  );
}
