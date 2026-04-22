'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const languages = [
  { code: 'FR', label: 'FR', flag: '🇫🇷' },
  { code: 'EN', label: 'EN', flag: '🇬🇧' },
  { code: 'ES', label: 'ES', flag: '🇪🇸' },
  { code: 'DE', label: 'DE', flag: '🇩🇪' },
];

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
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full flex items-center gap-1.5 transition hover:bg-zinc-800 ${
                  language === lang.code ? 'bg-rose-600 text-white' : ''
                }`}
              >
                <span>{lang.flag}</span>
                <span className="hidden lg:inline">{lang.label}</span>
              </button>
            ))}
          </div>

          {/* Langue Mobile */}
          <button
            onClick={() => {
              const currentIndex = languages.findIndex(l => l.code === language);
              const nextLang = languages[(currentIndex + 1) % languages.length].code;
              changeLanguage(nextLang);
            }}
            className="md:hidden bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-2xl text-sm font-medium flex items-center gap-2 border border-zinc-700 transition"
          >
            {languages.find(l => l.code === language)?.flag} {language}
          </button>

          {/* Bouton Messages */}
          <Link 
            href="/messages"
            className="bg-rose-600 hover:bg-rose-500 px-6 py-3 rounded-2xl text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap"
          >
            Messages
          </Link>

          {/* Hamburger */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-3xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-zinc-950 z-50 pt-20">
          <div className="flex flex-col p-8 space-y-8 text-xl">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
            <Link href="/creators" onClick={() => setIsMenuOpen(false)}>Créateurs</Link>
            <Link href="/sell" onClick={() => setIsMenuOpen(false)}>Vendre</Link>
            <Link href="/messages" onClick={() => setIsMenuOpen(false)}>Messages</Link>
          </div>
        </div>
      )}
    </header>
  );
}
