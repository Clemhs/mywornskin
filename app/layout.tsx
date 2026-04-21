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
        {/* Header Global */}
        <header className="border-b border-zinc-800 bg-black/90 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-rose-600 rounded-xl flex items-center justify-center font-bold text-lg">M</div>
              <span className="text-2xl font-bold tracking-tight">MyWornSkin</span>
            </div>

            <nav className="flex items-center gap-8 text-sm">
              <a href="/" className="hover:text-rose-400 transition">Accueil</a>
              <a href="/creators" className="hover:text-rose-400 transition">Créateurs</a>
              <a href="/sell" className="hover:text-rose-400 transition">Vendre</a>
              <a href="/messages" className="hover:text-rose-400 transition">Messages</a>
            </nav>

            <div className="text-xs text-zinc-500">
              Version reconstruite
            </div>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
