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
    // Choisir un texte aléatoire au chargement
    const randomText = heroTexts[Math.floor(Math.random() * heroTexts.length)];
    setCurrentText(randomText);

    // Optionnel : changer toutes les 30 secondes (pour tester)
    // const interval = setInterval(() => {
    //   const newText = heroTexts[Math.floor(Math.random() * heroTexts.length)];
    //   setCurrentText(newText);
    // }, 30000);

    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#4c1d95_0%,transparent_70%)] opacity-40"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="mb-8 inline-flex items-center gap-3 bg-zinc-900/80 backdrop-blur-md px-6 py-2 rounded-full border border-rose-500/20">
            <span className="text-rose-400">✦</span>
            <span className="text-sm tracking-widest uppercase">Vêtements portés • Histoires intimes</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none mb-8 tracking-tighter min-h-[2.2em]">
            {currentText}
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12">
            Des pièces déjà portées.<br />
            Avec leur odeur, leur chaleur, leur histoire.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/creators"
              className="bg-rose-600 hover:bg-rose-500 px-10 py-5 rounded-2xl text-lg font-semibold transition-all active:scale-95"
            >
              Découvrir les créateurs
            </Link>
            
            <Link
              href="/sell"
              className="border border-zinc-700 hover:border-rose-500 px-10 py-5 rounded-2xl text-lg font-semibold transition-all active:scale-95"
            >
              Mettre ma pièce en vente
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
