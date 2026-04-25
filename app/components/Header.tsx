'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const languages = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
];

export default function Header() {
  const { lang, changeLanguage, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-light tracking-tighter">MyWornSkin</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/creators" className="hover:text-pink-400 transition">{t('creators')}</Link>
          <Link href="/sell" className="hover:text-pink-400 transition">{t('sell')}</Link>
          <Link href="/messages" className="hover:text-pink-400 transition">{t('messages')}</Link>
          <Link href="/why-join" className="hover:text-pink-400 transition">Pourquoi nous rejoindre ?</Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Sélecteur langue compact */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-3xl text-sm transition"
            >
              <span className="text-base">{currentLang.flag}</span>
              <span className="hidden sm:inline font-medium">{currentLang.label}</span>
              <span className="text-xs">▼</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-3xl py-2 shadow-2xl z-50 w-44">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      changeLanguage(l.code as any);
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-5 py-3 text-left flex items-center gap-3 hover:bg-zinc-800 ${lang === l.code ? 'bg-zinc-800' : ''}`}
                  >
                    <span className="text-lg">{l.flag}</span>
                    <span className="font-medium">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/messages"
            className="w-9 h-9 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 rounded-2xl transition text-xl"
          >
            💬
          </Link>
        </div>
      </div>
    </header>
  );
}
