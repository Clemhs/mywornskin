import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import { LanguageProvider } from './contexts/LanguageContext';

export const metadata: Metadata = {
  title: 'MyWornSkin - Vêtements déjà portés',
  description: 'Plateforme intime pour acheter et vendre des vêtements portés.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-zinc-950 text-white">
        <LanguageProvider>
          <Header />
          <main className="pt-20">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
