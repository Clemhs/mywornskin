'use client';

import { useLanguage } from './context/LanguageContext';

export default function Home() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Boutons de langue en haut à droite */}
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

      {/* Contenu principal */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="max-w-4xl">
          <h1 className="text-7xl md:text-8xl font-bold tracking-tighter mb-6">
            {t('welcome')}
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-400 mb-12 max-w-2xl mx-auto">
            {t('discover')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-rose-600 hover:bg-rose-500 transition px-12 py-5 rounded-3xl text-xl font-semibold">
              {t('subscribe')}
            </button>
            
            <button className="bg-transparent border-2 border-white/70 hover:border-white transition px-12 py-5 rounded-3xl text-xl font-semibold">
              {t('sell')}
            </button>
          </div>
        </div>
      </div>

      {/* Petit footer décoratif */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500">
        MyWornSkin © 2026 — Vêtements portés avec histoire
      </div>
    </div>
  );
}
