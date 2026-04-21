import type { Metadata } from 'next';
import { LanguageProvider } from './context/LanguageContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'MyWornSkin',
  description: 'Vêtements portés avec une histoire',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <LanguageProvider>
          {/* Header Global Responsive */}
          <header className="bg-black border-b border-rose-900/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
              
              {/* Logo */}
              <a href="/" className="text-2xl font-bold tracking-tighter text-white hover:text-rose-400 transition">
                MyWornSkin
              </a>

              {/* Navigation Desktop */}
              <nav className="hidden md:flex gap-8 text-sm font-medium">
                <a href="/" className="hover:text-rose-400 transition">Accueil</a>
                <a href="/creators" className="hover:text-rose-400 transition">Créateurs</a>
                <a href="/sell" className="hover:text-rose-400 transition">Vendre</a>
                <a href="/messages" className="hover:text-rose-400 transition">Messages</a>
              </nav>

              {/* Boutons de langue + Menu mobile */}
              <div className="flex items-center gap-4">
                {/* Boutons de langue - plus petit sur mobile */}
                <div className="hidden sm:flex gap-2">
                  {(['fr', 'en', 'es', 'de'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { /* sera géré par le context plus tard */ }}
                      className="px-3 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 rounded-full transition"
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Menu burger pour mobile */}
                <button className="md:hidden text-2xl">
                  ☰
                </button>
              </div>
            </div>
          </header>

          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
