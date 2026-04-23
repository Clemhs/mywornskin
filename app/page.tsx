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
  const [currentText, setCurrentText] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <div className="relative h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Petit cadre élégant avec étoile */}
          <div className="inline-block border border-zinc-700 bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-10 md:p-14 shadow-2xl">
            
            {/* Petite étoile scintillante */}
            <div className="flex justify-start mb-6">
              <span className="text-5xl text-white/30 twinkle">✦</span>
            </div>

            <h1 className="hero-text text-4xl md:text-5xl font-medium leading-tight min-h-[2.8em] transition-all duration-1000">
              {heroTexts[currentText]}
            </h1>

          </div>

          {/* Boutons en dessous du cadre */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <Link href="/creators" className="btn-primary px-14 py-6 text-xl">
              Découvrir les créatrices
            </Link>
            <Link href="/sell" className="border border-zinc-700 hover:border-rose-500 px-14 py-6 text-xl rounded-3xl transition">
              Vendre mon vêtement
            </Link>
          </div>
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
    </div>
  );
}
