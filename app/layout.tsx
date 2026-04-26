import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MyWornSkin',
  description: 'Vêtements portés • Histoires intimes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-zinc-950 text-white">
        {/* Header commenté pour diagnostiquer l'infinite loading */}
        {/* <Header /> */}

        <main>{children}</main>
      </body>
    </html>
  );
}
