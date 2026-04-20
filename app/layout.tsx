import type { Metadata } from 'next';
import { LanguageProvider } from './context/LanguageContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'MyWornSkin',
  description: 'Vêtements portés uniques',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MyWornSkin',
  description: 'Vêtements déjà portés • Vibe intime • Rien que pour toi',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}
