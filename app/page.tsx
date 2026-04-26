'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, UserPlus } from 'lucide-react';
import Header from './components/Header';

const heroTexts = [
  {
    title: "✦ VÊTEMENTS PORTÉS • HISTOIRES INTIMES",
    subtitle: "Chaque pièce raconte une histoire. Chaque odeur porte un souvenir.",
  },
  {
    title: "✦ LA CHALEUR ENCORE PRÉSENTE",
    subtitle: "Portés avec passion. Vendus avec leur âme.",
  },
  {
    title: "✦ SENSUALITÉ AUTHENTIQUE",
    subtitle: "Odeur, chaleur, histoires intimes à découvrir.",
  },
];

export default function Home() {
  const router = useRouter();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentHero = heroTexts[currentTextIndex];

  return (
    <main className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      {/* HEADER */}
      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        
        {/* Dégradé radial ultra subtil rose/violet */}
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#f43f5e08_0%,#c026d308_45%,transparent_75%)]" />
        
        {/* Fond dark principal */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Hero Title */}
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6 transition-all duration-700">
            {currentHero.title}
          </h1>

          {/* Hero Subtitle */}
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 transition-all duration-700">
            {currentHero.subtitle}
          </p>

          {/* Boutons plus fins et raffinés */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            
            {/* Bouton PRINCIPAL */}
            <button
              onClick={() => router.push('/creators')}
              className="group relative flex items-center justify-center gap-3 px-9 py-4 bg-rose-500 hover:bg-rose-600 text-white font-medium text-lg rounded-2xl transition-all duration-300 shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5 group-active:rotate-12 transition-transform" />
              Découvrir les créatrices
            </button>

            {/* Bouton SECONDAIRE */}
            <button
              onClick={() => router.push('/become-creator')}
              className="group relative flex items-center justify-center gap-3 px-8 py-4 border border-rose-300/60 hover:border-rose-400 bg-transparent hover:bg-white/5 text-rose-300 hover:text-rose-200 font-medium text-lg rounded-2xl transition-all duration-300"
            >
              <UserPlus className="w-5 h-5" />
              Devenir créatrice
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 flex flex-col items-center gap-2 text-zinc-500">
            <span className="text-sm tracking-widest">SCROLL POUR DÉCOUVRIR</span>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-zinc-500 to-transparent" />
          </div>

          {/* Trust badges */}
          <div className="mt-20 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="text-rose-400">✓</span>
              Profils vérifiés
            </div>
            <div className="flex items-center gap-2">
              <span className="text-rose-400">✓</span>
              Paiements sécurisés
            </div>
            <div className="flex items-center gap-2">
              <span className="text-rose-400">✓</span>
              Expédition discrète
            </div>
            <div className="flex items-center gap-2">
              <span className="text-rose-400">✓</span>
              Messagerie privée
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
