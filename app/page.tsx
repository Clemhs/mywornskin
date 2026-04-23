'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const heroTexts = [
  "Vêtements portés avec passion. Histoires intimes à vendre.",
  "L’odeur de ma peau encore imprégnée dans le tissu.",
  "Ce que j’ai porté hier soir… maintenant à toi.",
  "Sensualité authentique. Pas de filtres, que du réel.",
  "Chaque vêtement raconte une histoire. La mienne.",
  "Porté près de ma peau. Vendu avec émotion.",
  "L’intimité que personne d’autre ne verra… sauf toi.",
  "Des traces de moi. Pour ton plaisir secret.",
];

export default function Home() {
  const [currentText, setCurrentText] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#4c1d95_0%,transparent_70%)] opacity-30" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <div className="text-[180px] leading-none font-light tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400">
              MyWornSkin
            </div>
          </div>

          <h1 className="hero-text text-5xl md:text-6xl font-medium mb-8 min-h-[3.5em] transition-all duration-1000">
            {heroTexts[currentText]}
          </h1>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/creators" className="btn-primary px-12 py-6 text-xl">
              Découvrir les créatrices
            </Link>
            <Link href="/sell" className="border border-zinc-700 hover:border-rose-500 px-12 py-6 text-xl rounded-3xl transition">
              Vendre mon vêtement
            </Link>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-zinc-500 text-sm flex flex-col items-center">
          <span>Scroll pour explorer</span>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-zinc-500 to-transparent mt-3" />
        </div>
      </div>

      {/* Quick Trust Bar */}
      <div className="border-b border-zinc-800 py-6 bg-zinc-900/50">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm text-zinc-400">
          <div>✅ Tous les profils vérifiés manuellement</div>
          <div>🔒 Paiements sécurisés</div>
          <div>📦 Expédition discrète en 72h</div>
          <div>💬 Messagerie privée protégée</div>
        </div>
      </div>
    </div>
  );
}
