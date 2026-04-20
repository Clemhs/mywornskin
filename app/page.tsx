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
    // Pour l'instant on affiche juste un message (on ajoutera la vraie traduction plus tard)
    alert(`🌍 Langue changée en ${lang.toUpperCase()} (traduction complète à venir)`);
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-black to-black">
        {/* Effet de fond subtil */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(236,72,153,0.08)_0%,transparent_60%)]"></div>

        {/* Sélecteur de langue - bien placé en haut à droite */}
        <div className="absolute top-8 right-8 z-50 flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code as 'fr' | 'en' | 'es' | 'de')}
              className={`px-6 py-2.5 text-sm font-medium tracking-widest rounded-2xl transition-all border ${
                currentLang === lang.code 
                  ? 'bg-white text-black border-white' 
                  : 'border-white/30 hover:border-white/70 hover:bg-white/10'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="mb-10">
            <span className="inline-block px-8 py-3 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 text-sm tracking-[4px] uppercase">
              INTIME • PORTÉ • DÉSIRÉ
            </span>
          </div>

          <h1 className="text-8xl md:text-[110px] font-bold tracking-[-3px] leading-none mb-8">
            MyWornSkin
          </h1>

          <p className="text-2xl md:text-3xl text-gray-300 max-w-2xl mx-auto mb-16 leading-relaxed">
            Des vêtements qui ont une histoire.<br />
            Des corps qui se racontent.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            {user ? (
              <>
                {hasSubscription ? (
                  <Link 
                    href="/exclusive"
                    className="bg-white text-black font-semibold py-6 px-16 rounded-3xl text-xl hover:bg-gray-100 transition-all active:scale-95"
                  >
                    Accéder à l'exclusif
                  </Link>
                ) : (
                  <Link 
                    href="/subscribe"
                    className="bg-white text-black font-semibold py-6 px-16 rounded-3xl text-xl hover:bg-gray-100 transition-all active:scale-95"
                  >
                    S'abonner
                  </Link>
                )}

                <Link 
                  href="/messages"
                  className="border border-white/60 hover:border-white font-semibold py-6 px-16 rounded-3xl text-xl transition-all hover:bg-white/5"
                >
                  Messagerie privée
                </Link>
              </>
            ) : (
              <Link 
                href="/auth"
                className="bg-white text-black font-semibold py-6 px-16 rounded-3xl text-xl hover:bg-gray-100 transition-all active:scale-95"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-xs tracking-widest text-gray-500 flex flex-col items-center">
          SCROLL POUR DÉCOUVRIR
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-400 to-transparent mt-3"></div>
        </div>
      </div>

      {/* Section Vente */}
      <div className="py-28 px-6 border-t border-white/10 bg-zinc-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8">Tu veux vendre tes pièces portées ?</h2>
          <p className="text-xl text-gray-400 mb-12">
            Transforme ton intimité en revenu. Partage tes vêtements déjà vécus avec ceux qui les désirent.
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
