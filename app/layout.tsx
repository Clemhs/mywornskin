import type { Metadata } from 'next';
import './globals.css';
import Header from './header';   // On va créer ce fichier juste après

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
        <Header />
        <main className="min-h-[calc(100vh-73px)]">
          {children}
        </main>
      </body>
    </html>
  );
}
