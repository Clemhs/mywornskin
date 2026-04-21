import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export const metadata: Metadata = {
  title: 'MyWornSkin',
  description: 'Vêtements déjà portés • Plateforme intime',
};

type Language = 'fr' | 'en' | 'es' | 'de';

const translations = {
  fr: { home: 'Accueil', creators: 'Créateurs', sell: 'Vendre', messages: 'Messages' },
  en: { home: 'Home', creators: 'Creators', sell: 'Sell', messages: 'Messages' },
  es: { home: 'Inicio', creators: 'Creadores', sell: 'Vender', messages: 'Mensajes' },
  de: { home: 'Start', creators: 'Ersteller', sell: 'Verkaufen', messages: 'Nachrichten' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentLang, setCurrentLang] = useState<Language>('fr');

  // Charger la langue sauvegardée
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) setCurrentLang(savedLang);
  }, []);

  const changeLanguage = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('language', lang);
    window.location.reload();
  };

  const t = translations[currentLang];

  return (
    <html lang={currentLang}>
      <body className="bg-zinc-950 text-white antialiased">
        {/* Header Global */}
        <header className="border-b border-zinc-800 bg-black/95 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <div className="w-9 h-9 bg-gradient-to-br from-rose-600 to-pink-600 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                M
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight">MyWornSkin</div>
                <div className="text-[10px] text-zinc-500 -mt-1">vêtements portés</div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="/" className="hover:text-rose-400 transition-colors">{t.home}</Link>
              <Link href="/creators" className="hover:text-rose-400 transition-colors">{t.creators}</Link>
              <Link href="/sell" className="hover:text-rose-400 transition-colors">{t.sell}</Link>
              <Link href="/messages" className="hover:text-rose-400 transition-colors">{t.messages}</Link>
            </nav>

            <div className="flex items-center gap-4">
              {/* Boutons de langue */}
              <div className="flex gap-1 bg-zinc-900 rounded-xl p-1 border border-zinc-800">
                {(['fr', 'en', 'es', 'de'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                      currentLang === lang 
                        ? 'bg-rose-600 text-white' 
                        : 'hover:bg-zinc-800'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <Link 
                href="/messages" 
                className="bg-rose-600 hover:bg-rose-500 px-6 py-2.5 rounded-xl text-sm font-medium transition"
              >
                Messages
              </Link>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-73px)]">
          {children}
        </main>
      </body>
    </html>
  );
}
