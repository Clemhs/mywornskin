'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

type Language = 'fr' | 'en' | 'es' | 'de'; 

const translations = {
  fr: { home: 'Accueil', creators: 'Créateurs', sell: 'Vendre', messages: 'Messages' },
  en: { home: 'Home', creators: 'Creators', sell: 'Sell', messages: 'Messages' },
  es: { home: 'Inicio', creators: 'Creadores', sell: 'Vender', messages: 'Mensajes' },
  de: { home: 'Start', creators: 'Ersteller', sell: 'Verkaufen', messages: 'Nachrichten' },
};

export default function Header() {
  const [currentLang, setCurrentLang] = useState<Language>('fr');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved) setCurrentLang(saved);
  }, []);

  const changeLanguage = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('language', lang);
    window.location.reload();
  };

  const t = translations[currentLang];

  return (
    <header className="border-b border-zinc-800 bg-black/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <div className="w-9 h-9 bg-gradient-to-br from-rose-600 via-rose-500 to-pink-600 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
            M
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">MyWornSkin</div>
            <div className="text-[10px] text-zinc-500 -mt-1">vêtements portés</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-9 text-sm font-medium">
          <Link href="/" className="hover:text-rose-400 transition-colors">{t.home}</Link>
          <Link href="/creators" className="hover:text-rose-400 transition-colors">{t.creators}</Link>
          <Link href="/sell" className="hover:text-rose-400 transition-colors">{t.sell}</Link>
          <Link href="/messages" className="hover:text-rose-400 transition-colors">{t.messages}</Link>
        </nav>

        <div className="flex items-center gap-5">
          <div className="flex gap-1 bg-zinc-900 rounded-2xl p-1 border border-zinc-800">
            {(['fr', 'en', 'es', 'de'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`px-4 py-1.5 text-xs font-medium rounded-xl transition-all ${
                  currentLang === lang 
                    ? 'bg-rose-600 text-white shadow-sm' 
                    : 'hover:bg-zinc-800'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <Link 
            href="/messages" 
            className="bg-rose-600 hover:bg-rose-500 px-7 py-3 rounded-2xl text-sm font-medium transition flex items-center gap-2"
          >
            Messages
          </Link>
        </div>
      </div>
    </header>
  );
}
