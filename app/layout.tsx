import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MyWornSkin',
  description: 'Vêtements déjà portés • Plateforme intime',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-zinc-950 text-white antialiased">
        {/* Header Global avec boutons de langue */}
        <header className="border-b border-zinc-800 bg-black/95 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-rose-600 to-pink-600 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                M
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight">MyWornSkin</div>
                <div className="text-[10px] text-zinc-500 -mt-1">vêtements portés</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="/" className="hover:text-rose-400 transition-colors">Accueil</a>
              <a href="/creators" className="hover:text-rose-400 transition-colors">Créateurs</a>
              <a href="/sell" className="hover:text-rose-400 transition-colors">Vendre</a>
              <a href="/messages" className="hover:text-rose-400 transition-colors">Messages</a>
            </nav>

            <div className="flex items-center gap-4">
              {/* Boutons de langue */}
              <div className="flex gap-1 bg-zinc-900 rounded-xl p-1 border border-zinc-800">
                <a href="#" className="px-3 py-1 text-xs font-medium rounded-lg bg-rose-600 text-white">FR</a>
                <a href="#" className="px-3 py-1 text-xs font-medium rounded-lg hover:bg-zinc-800 transition">EN</a>
                <a href="#" className="px-3 py-1 text-xs font-medium rounded-lg hover:bg-zinc-800 transition">ES</a>
                <a href="#" className="px-3 py-1 text-xs font-medium rounded-lg hover:bg-zinc-800 transition">DE</a>
              </div>

              <a 
                href="/messages" 
                className="bg-rose-600 hover:bg-rose-500 px-6 py-2.5 rounded-xl text-sm font-medium transition"
              >
                Messages
              </a>
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
