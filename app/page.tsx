'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '../components/Header';

const heroTexts = [
  "Vêtements portés avec passion. Histoires intimes à vendre.",
  "L’odeur de ma peau encore imprégnée dans le tissu.",
  // ... (je garde tout ton tableau tel quel, je ne le recopie pas ici pour gagner de la place)
  "Ce qui a été contre ma peau pendant des heures."
];

export default function Home() {
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * heroTexts.length);
    setCurrentText(heroTexts[randomIndex]);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <div className="relative h-screen flex items-center justify-center pt-4 md:pt-0"> {/* pt réduit car Header fait 64px */}
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#4c1d95_0%,transparent_65%)] opacity-30"></div>
      
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          
          <div className="mb-8 md:mb-6">
            <div className="text-5xl md:text-6xl font-light tracking-[-0.04em] text-white">
              MyWornSkin
            </div>
          </div>

          <div className="mb-8 inline-flex items-center gap-3 bg-zinc-900/70 backdrop-blur-md px-8 py-3 rounded-full border border-rose-500/20">
            <span
              className="text-rose-400 text-xl"
              style={{
                animation: 'gentleTwinkle 3s infinite ease-in-out',
                textShadow: '0 0 8px rgba(244, 63, 94, 0.6)'
              }}
            >
              ✦
            </span>
            <span className="uppercase tracking-[3px] text-sm font-medium">VÊTEMENTS PORTÉS • HISTOIRES INTIMES</span>
          </div>

          <h1 className="hero-text text-5xl md:text-6xl lg:text-7xl mb-10 min-h-[2.4em] leading-none tracking-tighter">
            {currentText}
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-14">
            Des pièces déjà portées.<br className="hidden md:block" />
            Avec leur odeur, leur chaleur, leur histoire.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/creators" className="btn-primary px-14 py-7 text-xl font-medium">
              Découvrir les créatrices
            </Link>
            <Link href="/sell" className="btn-secondary px-14 py-7 text-xl font-medium">
              Mettre ma pièce en vente
            </Link>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500">
          <div className="text-xs tracking-widest">SCROLL POUR DÉCOUVRIR</div>
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-zinc-400 to-transparent"></div>
        </div>
      </div>

      {/* La bande de confiance reste identique */}
      <div className="border-b border-zinc-800 py-6 bg-zinc-900/50">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm text-zinc-400">
          <div>✅ Tous les profils vérifiés manuellement</div>
          <div>🔒 Paiements sécurisés</div>
          <div>📦 Expédition discrète en 72h</div>
          <div>💬 Messagerie privée protégée</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gentleTwinkle {
          0%, 100% { opacity: 0.85; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}
