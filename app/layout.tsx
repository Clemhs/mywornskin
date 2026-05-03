import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'MyWornSkin',
  description: 'Vêtements intimes portés',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} bg-black text-white`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
