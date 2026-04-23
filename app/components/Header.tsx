'use client';

import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

const languages = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
];

export default function Header() {
  const { lang, changeLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-light tracking-tighter">MyWornSkin</span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/creators" className="hover:text-rose-400 transition">{t('creators')}</Link>
          <Link href="/sell" className="hover:text-rose-400 transition">{t('sell')}</Link>
          <Link href="/messages" className="hover:text-rose-400 transition">{t('messages')}</Link>
          <Link href="/why-join" className="hover:text-rose-400 transition">Pourquoi nous rejoindre ?</Link>
        </nav>

        {/* Langues + Messages */}
        <div className="flex items-center gap-4">
          {/* Langues */}
          <div className="flex bg-zinc-900 rounded-3xl p-1">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => changeLanguage(l.code as any)}
                className={`px-4 py-2 text-xs rounded-3xl transition flex items-center gap-1.5 ${lang === l.code ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                <span>{l.flag}</span>
                <span className="hidden sm:inline">{l.label}</span>
              </button>
            ))}
          </div>

          <Link 
            href="/messages" 
            className="w-10 h-10 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 rounded-2xl transition"
          >
            💬
          </Link>
        </div>
      </div>
    </header>
  );
}
