'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const heroTexts = [
  "Ce qui a touché ta peau.",
  "Des vêtements qui portent encore ton odeur.",
  "L’intimité que l’on peut acheter.",
  "Porté. Ressenti. Mis en vente.",
  "Chaque pièce a une histoire… la tienne.",
  "Ce que mes doigts ont caressé.",
  "Vêtements encore chauds de désir.",
  "L’empreinte invisible de mon corps.",
  "Ce que je portais quand je pensais à toi.",
  "Sensualité à vendre.",
  "Des secondes de ma vie, à emporter.",
  "Ce tissu qui a connu ma peau nue.",
  "Un peu de moi, entre tes mains.",
  "Porté avec envie. Vendu avec nostalgie.",
  "L’odeur de mes nuits.",
  "Ce que je ne porte plus… mais que tu peux.",
  "Intime. Personnel. Unique.",
  "Le souvenir d’un frisson.",
  "Vêtements qui ont vécu.",
  "Ma chaleur, maintenant à toi.",
  "Ce que mon corps a embrassé.",
  "Des traces invisibles de plaisir.",
  "Un morceau de mon intimité.",
  "Porté hier. Désiré aujourd’hui.",
  "La douceur qui a touché mes courbes.",
  "Ce que je gardais pour moi… jusqu’à maintenant.",
  "Sensations à emporter.",
  "Mon secret le plus doux.",
  "Ce tissu sait tout de moi.",
  "Un peu de ma peau, en édition limitée.",
];

export default function Home() {
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * heroTexts.length);
    setCurrentText(heroTexts[randomIndex]);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="relative h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#4c1d95_0%,transparent_65%)] opacity-30"></div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Bandeau avec deux étoiles presque superposées */}
          <div className="mb-8 inline-flex items-center gap-3 bg-zinc-900/70 backdrop-blur-md px-8 py-3 rounded-full border border-rose-500/20 relative">

            {/* Étoile principale (grosse) - à gauche */}
            <span 
              className="star-large text-rose-400 text-[34px] relative z-10"
              style={{
                animation: 'shootingStarLarge 4.2s ease-out forwards, twinkle 2.8s infinite 1.2s'
              }}
            >
              ✧
            </span>

            {/* Petite étoile - à droite, légèrement en haut et dessous, presque superposée */}
            <span 
              className="star-small text-rose-400 text-[21px] absolute top-[-3px] left-[29px] z-0"
              style={{
                animation: 'shootingStarSmall 4.0s ease-out forwards 0.3s, twinkle 2.4s infinite 1.4s'
              }}
            >
              ✦
            </span>

            <span className="uppercase tracking-[3px] text-sm font-medium pl-10">Vêtements portés • Histoires intimes</span>
          </div>

          <h1 className="hero-text text-6xl md:text-7xl lg:text-8xl mb-10 min-h-[2.4em] leading-none tracking-tighter">
            {currentText}
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-14">
            Des pièces déjà portées.<br className="hidden md:block" />
            Avec leur odeur, leur chaleur, leur histoire.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/creators"
              className="btn-primary"
            >
              Découvrir les créateurs
            </Link>
            <Link
              href="/sell"
              className="btn-secondary"
            >
              Mettre ma pièce en vente
            </Link>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500">
          <div className="text-xs tracking-widest">SCROLL POUR DÉCOUVRIR</div>
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-zinc-400 to-transparent"></div>
        </div>
      </div>

      {/* Animations CSS intégrées */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.8; transform: scale(0.92); }
          50% { opacity: 1; transform: scale(1.16); }
        }

        @keyframes shootingStarLarge {
          0% { opacity: 0; transform: translate(-30px, -35px) scale(0.6); }
          25% { opacity: 1; transform: translate(8px, 10px) scale(1.18); }
          70% { opacity: 1; }
          100% { opacity: 0.9; transform: translate(12px, 15px) scale(1); }
        }

        @keyframes shootingStarSmall {
          0% { opacity: 0; transform: translate(-18px, -22px) scale(0.55); }
          30% { opacity: 1; transform: translate(10px, 6px) scale(1.1); }
          75% { opacity: 1; }
          100% { opacity: 0.85; transform: translate(14px, 11px) scale(0.95); }
        }

        .star-large {
          animation: shootingStarLarge 4.2s ease-out forwards, twinkle 2.8s infinite 1.2s;
        }

        .star-small {
          animation: shootingStarSmall 4.0s ease-out forwards 0.3s, twinkle 2.4s infinite 1.4s;
        }
      `}</style>
    </div>
  );
}
