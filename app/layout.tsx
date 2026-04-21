import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MyWornSkin',
  description: 'Vêtements déjà portés',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}
