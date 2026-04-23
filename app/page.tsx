'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const heroTexts = [
  "Vêtements portés avec passion. Histoires intimes à vendre.",
  "L’odeur de ma peau encore imprégnée dans le tissu.",
  "Ce que j’ai porté hier soir… maintenant à toi.",
  "Sensualité authentique. Pas de filtres, que du réel.",
  "Chaque vêtement raconte une histoire. La mienne.",
  "Porté près de ma peau. Vendu avec émotion.",
  "L’intimité que personne d’autre ne verra… sauf toi.",
  "Des traces de moi. Pour ton plaisir secret.",
  "Le souvenir de mon corps encore chaud sur le tissu.",
  "Ce qui a frôlé ma peau toute la journée.",
  "Vêtements chargés de désir et de souvenirs.",
  "Ce que je portais quand je pensais à toi.",
  "Odeur intime, texture unique, émotion brute.",
  "Un morceau de moi à emporter chez toi.",
  "Porté avec envie. Vendu avec sincérité.",
  "La chaleur de mes courbes encore présente.",
  "Secret porté contre ma peau toute la nuit.",
  "Ce qui a connu mes mouvements les plus intimes.",
  "Vêtements qui ont vécu avec moi.",
  "L’empreinte invisible de mon corps.",
  "Sensations portées. Désirs partagés.",
  "Ce que je retire le soir… et que tu peux posséder.",
  "Intimité textile. Plaisir personnel.",
  "Chaque fibre garde mon parfum et mon histoire.",
  "Porté pendant mes moments les plus intenses.",
  "Un bout de ma vie quotidienne à vendre.",
  "La douceur de ma peau capturée dans le tissu.",
  "Ce qui était contre moi il y a quelques heures.",
  "Vêtements imprégnés de mon essence.",
  "L’histoire secrète que seul le tissu connaît.",
  "Ce que je portais quand j’étais seule avec mes envies.",
  "Trace olfactive et tactile de mon corps.",
  "Vendu avec son histoire. Pas seulement un vêtement.",
  "Ce qui a caressé ma peau du matin au soir.",
  "Intime. Personnel. À toi maintenant.",
  "Le vêtement qui connaît tous mes secrets.",
  "Porté avec désir. Offert avec confiance.",
  "L’empreinte chaude de mes journées.",
  "Ce qui respirait avec moi.",
  "Vêtements chargés d’émotions interdites.",
  "Un fragment de ma sensualité quotidienne.",
  "Ce que mes courbes ont marqué.",
  "Souvenirs textiles à collectionner.",
  "L’odeur de mes nuits. La douceur de mes jours.",
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
      <div className="relative h-screen flex items-center justify-center pt-8 md:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#4c1d95_0%,transparent_65%)] opacity-30"></div>
       
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          
          {/* Titre MyWornSkin plus haut et plus visible sur mobile */}
          <div className="mb-8 md:mb-6">
            <div className="text-5xl md:text-6xl font-light tracking-[-0.04em] text-white">
              MyWornSkin
            </div>
          </div>

          {/* Bandeau avec petite étoile scintillante */}
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
            <Link href="/creators" className="btn-primary">
              Découvrir les créatrices
            </Link>
            <Link href="/sell" className="btn-secondary">
              Mettre ma pièce en vente
            </Link>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500">
          <div className="text-xs tracking-widest">SCROLL POUR DÉCOUVRIR</div>
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-zinc-400 to-transparent"></div>
        </div>
      </div>

      {/* Trust bar */}
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
