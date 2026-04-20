'use client';

import { useLanguage } from './context/LanguageContext';
import Link from 'next/link';

export default function Home() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Boutons de langue */}
      <div className="absolute top-8 right-8 flex gap-3 z-50">
        {(['fr', 'en', 'es', 'de'] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              language === lang 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50' 
                : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700'
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center relative">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 leading-none">
            {t('welcome')}
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-400 mb-12 max-w-2xl mx-auto">
            {t('discover')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* Bouton principal : Explorer les créateurs */}
            <Link href="/creators">
              <button className="bg-rose-600 hover:bg-rose-500 transition-all px-14 py-6 rounded-3xl text-xl font-semibold w-full sm:w-auto">
                Explorer les créateurs
              </button>
            </Link>
            
            {/* Bouton secondaire : Vendre */}
            <Link href="/sell">
              <button className="border-2 border-white/70 hover:border-white transition-all px-14 py-6 rounded-3xl text-xl font-semibold w-full sm:w-auto">
                {t('sell')}
              </button>
            </Link>
          </div>
        </div>

        {/* Petit texte décoratif */}
        <div className="absolute bottom-12 text-xs text-gray-500 tracking-widest">
          MyWornSkin © 2026 — Vêtements portés avec passion
        </div>
      </div>
    </div>
  );
}
