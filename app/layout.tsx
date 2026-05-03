import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/app/contexts/LanguageContext';

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'MyWornSkin',
  description: 'Vêtements intimes portés avec passion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen flex flex-col`}>
        <LanguageProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
