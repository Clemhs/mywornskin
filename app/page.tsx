'use client';

import Link from 'next/link';
import { Sparkles, Camera, Users, Award } from 'lucide-react';
import StoryCard from '@/components/StoryCard'; // on créera ce composant après si besoin

const heroTexts = [
  "Vêtements portés avec passion",
  "Histoires intimes à vendre",
  "Odeurs authentiques",
  "Sensualité réelle",
  "Moments uniques capturés",
];

const featuredProducts = [
  { id: "1", title: "Culotte en dentelle noire", creator: "Léa Moreau", creatorSlug: "lea-moreau", price: 45, image: "https://picsum.photos/id/1015/600/800", hasStory: true, hasVoice: true, wornDays: 3 },
  { id: "2", title: "Bas résille déchirés", creator: "Clara Voss", creatorSlug: "clara-voss", price: 32, image: "https://picsum.photos/id/201/600/800", hasStory: true, hasVoice: false, wornDays: 1 },
  { id: "3", title: "Chemise blanche froissée", creator: "Emma Laurent", creatorSlug: "emma-laurent", price: 68, image: "https://picsum.photos/id/251/600/800", hasStory: true, hasVoice: true, wornDays: 2 },
  { id: "4", title: "String rouge passion", creator: "Léa Moreau", creatorSlug: "lea-moreau", price: 28, image: "https://picsum.photos/id/1027/600/800", hasStory: true, hasVoice: true, wornDays: 4 },
];

export default function Home() {
  const randomText = heroTexts[Math.floor(Math.random() * heroTexts.length)];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#4c1d95_0%,transparent_70%)] opacity-30" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-6xl sm:text-7xl font-light tracking-widest mb-6">
            {randomText}
          </h1>
          <p className="text-xl sm:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            Vêtements chargés d’histoires intimes et d’odeurs authentiques.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/shop" 
              className="px-10 py-5 bg-white text-black font-semibold text-lg rounded-3xl hover:bg-rose-400 hover:text-white transition-all"
            >
              Découvrir les pièces
            </Link>
            <Link 
              href="/become-creator" 
              className="px-10 py-5 border border-rose-400 text-rose-400 font-semibold text-lg rounded-3xl hover:bg-rose-400 hover:text-white transition-all flex items-center justify-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              Devenir créatrice
            </Link>
          </div>
        </div>
      </div>

      {/* Dernières pièces */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-4xl font-bold">Dernières pièces portées</h2>
          <Link href="/shop" className="text-rose-400 hover:text-rose-300 flex items-center gap-2 text-sm font-medium">
            Tout voir <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {featuredProducts.map((product) => (
            <StoryCard
              key={product.id}
              id={product.id}
              title={product.title}
              creator={product.creator}
              creatorSlug={product.creatorSlug}
              price={product.price}
              image={product.image}
              hasStory={product.hasStory}
              hasVoice={product.hasVoice}
              wornDays={product.wornDays}
            />
          ))}
        </div>
      </div>

      {/* Comment ça marche */}
      <div className="bg-zinc-900 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Comment ça marche ?</h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-rose-500/10 rounded-3xl flex items-center justify-center mb-6">
                <Camera className="w-10 h-10 text-rose-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Pour les créatrices</h3>
              <p className="text-zinc-400">Créez votre pièce, racontez votre histoire intime et mettez-la en vente.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-purple-500/10 rounded-3xl flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Pour les acheteurs</h3>
              <p className="text-zinc-400">Découvrez des pièces uniques chargées d’émotions et d’odeurs authentiques.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-amber-500/10 rounded-3xl flex items-center justify-center mb-6">
                <Award className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Une connexion unique</h3>
              <p className="text-zinc-400">Chaque pièce raconte une vraie histoire intime.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
