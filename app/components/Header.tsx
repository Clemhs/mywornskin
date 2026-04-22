'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [language, setLanguage] = useState('FR');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'FR';
    setLanguage(savedLang);
  }, []);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    window.location.reload();
  };

  const flag = (lang: string) => {
    const flags: any = { FR: '🇫🇷', EN: '🇬🇧', ES: '🇪🇸', DE: '🇩🇪' };
    return flags[lang] || '🌍';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-lg border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-md group-hover:scale-110 transition">
            M
          </div>
          <span className="font-bold text-xl sm:text-2xl tracking-tighter">MyWornSkin</span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-rose-400 transition">Accueil</Link>
          <Link href="/creators" className="hover:text-rose-400 transition">Créateurs</Link>
          <Link href="/sell" className="hover:text-rose-400 transition">Vendre</Link>
        </nav>

        {/* Partie droite */}
        <div className="flex items-center gap-4">
          {/* Langues Desktop */}
          <div className="hidden md:flex bg-zinc-900 rounded-full p-1 border border-zinc-800">
            {['FR', 'EN', 'ES', 'DE'].map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full flex items-center gap-1 transition hover:bg-zinc-800 ${
                  language === lang ? 'bg-rose-600 text-white' : ''
                }`}
              >
                <span>{flag(lang)}</span>
                <span className="hidden lg:inline">{lang}</span>
              </button>
            ))}
          </div>

          {/* Langue Mobile */}
          <button
            onClick={() => {
              const langs = ['FR', 'EN', 'ES', 'DE'];
              const currentIndex = langs.indexOf(language);
              const nextLang = langs[(currentIndex + 1) % langs.length];
              changeLanguage(nextLang);
            }}
            className="md:hidden bg-zinc-900 hover:bg-zinc-800 px-3.5 py-2 rounded-2xl text-sm font-medium flex items-center gap-1.5 border border-zinc-700 transition"
          >
            {flag(language)}
          </button>

          {/* Bouton Messages */}
          <Link 
            href="/messages"
            className="bg-rose-600 hover:bg-rose-500 px-6 py-3 rounded-2xl text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap"
          >
            Messages
          </Link>

          {/* Hamburger Menu - Mobile */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-3xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Menu Mobile Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-zinc-950 z-50 pt-20">
          <div className="flex flex-col p-6 space-y-6 text-lg">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="hover:text-rose-400">Accueil</Link>
            <Link href="/creators" onClick={() => setIsMenuOpen(false)} className="hover:text-rose-400">Créateurs</Link>
            <Link href="/sell" onClick={() => setIsMenuOpen(false)} className="hover:text-rose-400">Vendre</Link>
            <Link href="/messages" onClick={() => setIsMenuOpen(false)} className="hover:text-rose-400">Messages</Link>
          </div>
        </div>
      )}
    </header>
  );
}
