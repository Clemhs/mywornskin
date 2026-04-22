'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [language, setLanguage] = useState('FR');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'FR';
    setLanguage(savedLang);
  }, []);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    // Pour l'instant on simule, on ajoutera la vraie traduction plus tard
    window.location.reload(); // Temporaire pour voir le changement
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-rose-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl group-hover:scale-110 transition">
            M
          </div>
          <div>
            <span className="font-bold text-2xl tracking-tighter">MyWornSkin</span>
            <p className="text-[10px] text-zinc-500 -mt-1">vêtements portés</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
          <Link href="/" className="hover:text-rose-400 transition">Accueil</Link>
          <Link href="/creators" className="hover:text-rose-400 transition">Créateurs</Link>
          <Link href="/sell" className="hover:text-rose-400 transition">Vendre</Link>
          <Link href="/messages" className="hover:text-rose-400 transition">Messages</Link>
        </nav>

        {/* Langues + Messages */}
        <div className="flex items-center gap-4">
          <div className="flex bg-zinc-900 rounded-full p-1 border border-zinc-800">
            {['FR', 'EN', 'ES', 'DE'].map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition ${
                  language === lang 
                    ? 'bg-rose-600 text-white' 
                    : 'hover:bg-zinc-800'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <Link 
            href="/messages"
            className="bg-rose-600 hover:bg-rose-500 px-6 py-2.5 rounded-2xl text-sm font-semibold transition flex items-center gap-2"
          >
            Messages
          </Link>
        </div>
      </div>
    </header>
  );
}
