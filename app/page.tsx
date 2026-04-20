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
  const [currentLang, setCurrentLang] = useState<'fr' | 'en' | 'es' | 'de'>('fr');

  const languages = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
    { code: 'de', label: 'DE' },
  ];

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

  const changeLanguage = (lang: 'fr' | 'en' | 'es' | 'de') => {
    setCurrentLang(lang);
    alert(`🌍 Langue changée en ${lang.toUpperCase()} (traduction complète à venir)`);
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section - Optimisé mobile */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-black to-black px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(236,72,153,0.08)_0%,transparent_60%)]"></div>

        {/* Sélecteur de langue - bien visible sur mobile */}
        <div className="absolute top-6 right-4 z-50 flex gap-1.5">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code as 'fr' | 'en' | 'es' | 'de')}
              className={`px-4 py-2 text-xs font-medium tracking-widest rounded-2xl transition-all border ${
                currentLang === lang.code 
                  ? 'bg-white text-black border-white' 
                  : 'border-white/30 hover:border-white/70 hover:bg-white/10'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <span className="inline-block px-6 py-2.5 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 text-xs tracking-[3px] uppercase">
              INTIME • PORTÉ • DÉSIRÉ
            </span>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-[-3px] leading-none mb-8">
            MyWornSkin
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-16 leading-relaxed px-4">
            Des vêtements qui ont une histoire.<br className="hidden sm:block" />
            Des corps qui se racontent.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            {user ? (
              <>
                {hasSubscription ? (
                  <Link 
                    href="/exclusive"
                    className="bg-white text-black font-semibold py-5 px-12 rounded-3xl text-lg sm:text-xl active:scale-95 transition-all"
                  >
                    Accéder à l'exclusif
                  </Link>
                ) : (
                  <Link 
                    href="/subscribe"
                    className="bg-white text-black font-semibold py-5 px-12 rounded-3xl text-lg sm:text-xl active:scale-95 transition-all"
                  >
                    S'abonner
                  </Link>
                )}

                <Link 
                  href="/messages"
                  className="border border-white/60 hover:border-white font-semibold py-5 px-12 rounded-3xl text-lg sm:text-xl active:scale-95 transition-all"
                >
                  Messagerie privée
                </Link>
              </>
            ) : (
              <Link 
                href="/auth"
                className="bg-white text-black font-semibold py-5 px-12 rounded-3xl text-lg sm:text-xl active:scale-95 transition-all"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Section Vente - optimisée mobile */}
      <div className="py-20 sm:py-28 px-6 border-t border-white/10 bg-zinc-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Tu veux vendre tes pièces ?</h2>
          <p className="text-base sm:text-xl text-gray-400 mb-12 max-w-md mx-auto">
            Transforme ton intimité en revenu. Partage tes vêtements déjà vécus.
          </p>
          <Link 
            href="/sell"
            className="inline-block border-2 border-white/70 hover:border-white px-14 sm:px-20 py-6 rounded-3xl text-lg sm:text-2xl font-medium transition-all hover:bg-white hover:text-black w-full sm:w-auto"
          >
            Commencer à vendre →
          </Link>
        </div>
      </div>
    </div>
  );
}
