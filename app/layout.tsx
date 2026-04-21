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
          {/* Header global */}
          <header className="bg-black border-b border-rose-900/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
              <a href="/" className="text-2xl font-bold tracking-tighter text-white hover:text-rose-400 transition">
                MyWornSkin
              </a>

              <nav className="flex gap-8 text-sm font-medium">
                <a href="/" className="hover:text-rose-400 transition">Accueil</a>
                <a href="/creators" className="hover:text-rose-400 transition">Créateurs</a>
                <a href="/sell" className="hover:text-rose-400 transition">Vendre</a>
                <a href="/messages" className="hover:text-rose-400 transition">Messages</a>
              </nav>

              <div className="text-sm text-gray-400">
                Connecté
              </div>
            </div>
          </header>

          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
