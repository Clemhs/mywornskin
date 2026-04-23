import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';

export const metadata: Metadata = {
  title: 'MyWornSkin',
  description: 'Vêtements déjà portés • Intimité authentique',
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
          <main className="pt-16">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
