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
    // Plus tard on ajoutera la vraie traduction i18n
    alert(`Langue changée en ${lang.toUpperCase()} (traduction complète à venir)`);
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#3a1f4a_0%,#0a0a0a_70%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent"></div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          {/* Sélecteur de langue */}
          <div className="absolute top-8 right-8 flex gap-2 z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code as 'fr' | 'en' | 'es' | 'de')}
                className={`px-5 py-2 text-sm font-medium tracking-widest rounded-full transition-all border ${
                  currentLang === lang.code 
                    ? 'bg-white text-black border-white' 
                    : 'border-white/30 hover:border-white/70'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="mb-8 inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-8 py-3 rounded-full border border-white/10">
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
                    Accéder à l'exclusif
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
