'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, UserPlus, Heart, Star, Play, Package, Eye } from 'lucide-react';
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
  const [currentTextIndex] = useState(() => Math.floor(Math.random() * heroTexts.length));
  const currentHero = heroTexts[currentTextIndex];

  return (
    <main className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        
        {/* Fond dark principal */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
        
        {/* Dégradé violet/rose très subtil et élégant */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#a855f715_0%,#f43f5e10_45%,transparent_75%)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          
          {/* Texte hero - style manuscrit fin et sensuel */}
          <h1 className="text-5xl md:text-6xl font-serif italic font-light tracking-[0.08em] leading-none mb-6 transition-all duration-700">
            {currentHero.title}
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 transition-all duration-700">
            {currentHero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <button
              onClick={() => router.push('/creators')}
              className="group relative flex items-center justify-center gap-3 px-9 py-4 bg-rose-500 hover:bg-rose-600 text-white font-medium text-lg rounded-2xl transition-all duration-300 shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5" />
              Découvrir les créatrices
            </button>

            <button
              onClick={() => router.push('/become-creator')}
              className="group relative flex items-center justify-center gap-3 px-8 py-4 border border-rose-300/60 hover:border-rose-400 bg-transparent hover:bg-white/5 text-rose-300 hover:text-rose-200 font-medium text-lg rounded-2xl transition-all duration-300"
            >
              <UserPlus className="w-5 h-5" />
              Devenir créatrice
            </button>
          </div>

          <div className="mt-16 flex flex-col items-center gap-2 text-zinc-500">
            <span className="text-sm tracking-widest">SCROLL POUR DÉCOUVRIR</span>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-zinc-500 to-transparent" />
          </div>
        </div>
      </section>

      {/* Les autres sections restent identiques (Dernières pièces, Créatrices, Comment ça marche) */}
      {/* ... (le reste du code est inchangé) */}

    </main>
  );
}
