'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, UserPlus, Heart, Star, Play, Package, Eye } from 'lucide-react';
import Header from './components/Header';
import StoryCard from './components/StoryCard';

const heroTexts = [
  {
    title: "Vêtements portés • Histoires intimes",
    subtitle: "Chaque pièce raconte une histoire. Chaque odeur porte un souvenir.",
  },
  {
    title: "La chaleur encore présente",
    subtitle: "Portés avec passion. Vendus avec leur âme.",
  },
  {
    title: "Sensualité authentique",
    subtitle: "Odeur, chaleur, histoires intimes à découvrir.",
  },
];

export default function Home() {
  const router = useRouter();
  const [currentTextIndex] = useState(() => Math.floor(Math.random() * heroTexts.length));
  const currentHero = heroTexts[currentTextIndex];

  return (
    <main className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#a855f715_0%,#f43f5e10_45%,transparent_75%)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h1 className="font-serif italic font-thin tracking-widest text-6xl md:text-7xl leading-none mb-6 transition-all duration-700">
            {currentHero.title}
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 transition-all duration-700">
            {currentHero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <button
              onClick={() => router.push('/creators')}
              className="group relative flex items-center justify-center gap-3 px-9 py-4 bg-rose-500 hover:bg-rose-600 text-white font-medium text-lg rounded-2xl transition-all duration-300 shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5" />
              Découvrir les créatrices
            </button>

            <button
              onClick={() => router.push('/become-creator')}
              className="group relative flex items-center justify-center gap-3 px-8 py-4 border border-rose-300/60 hover:border-rose-400 bg-transparent hover:bg-white/5 text-rose-300 hover:text-rose-200 font-medium text-lg rounded-2xl transition-all duration-300"
            >
              <UserPlus className="w-5 h-5" />
              Devenir créatrice
            </button>
          </div>

          <div className="mt-16 flex flex-col items-center gap-2 text-zinc-500">
            <span className="text-sm tracking-widest">SCROLL POUR DÉCOUVRIR</span>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-zinc-500 to-transparent" />
          </div>
        </div>
      </section>

      {/* SECTION 1 : DERNIÈRES PIÈCES (avec les vrais StoryCard) */}
      <section className="py-16 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center md:text-left">Dernières pièces portées</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <StoryCard
              id="1"
              title="Culotte en dentelle noire"
              price={45}
              wornDays={3}
              image="https://picsum.photos/id/1015/600/800"
              hasStory={true}
              hasVoice={true}
              excerpt="Portée pendant trois jours entiers... l'odeur est encore très présente, un mélange de ma peau et de mon parfum préféré."
            />

            <StoryCard
              id="2"
              title="Bas résille déchirés"
              price={32}
              wornDays={1}
              image="https://picsum.photos/id/201/600/800"
              hasStory={true}
              hasVoice={false}
              excerpt="Je les ai portés toute la nuit lors d'une soirée très spéciale... ils gardent encore la chaleur de ma peau."
            />

            <StoryCard
              id="3"
              title="Chemise blanche froissée"
              price={68}
              wornDays={2}
              image="https://picsum.photos/id/251/600/800"
              hasStory={true}
              hasVoice={true}
              excerpt="Portée au bureau pendant deux jours... avec quelques boutons défaits. L'histoire est assez intime."
            />

          </div>
        </div>
      </section>

      {/* SECTION 2 : CRÉATRICES MISES EN AVANT */}
      <section className="py-20 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center md:text-left">Créatrices mises en avant</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Léa", rating: 4.9 },
              { name: "Clara", rating: 5.0 },
              { name: "Emma", rating: 4.8 },
              { name: "Nina", rating: 4.7 },
            ].map((creator) => (
              <div key={creator.name} className="text-center group">
                <div className="w-24 h-24 mx-auto bg-zinc-800 rounded-2xl flex items-center justify-center text-5xl mb-4 group-hover:scale-105 transition-transform">👩‍❤️‍💋‍👩</div>
                <p className="font-semibold">{creator.name}</p>
                <div className="flex justify-center items-center gap-1 text-amber-400 text-sm mt-1">
                  <Star className="w-4 h-4 fill-current" /> {creator.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 : COMMENT ÇA MARCHE */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-rose-400" />
              </div>
              <h3 className="font-semibold text-xl mb-2">1. Tu découvres</h3>
              <p className="text-zinc-400">Des pièces uniques portées avec passion, accompagnées de leur histoire intime et de leur odeur authentique.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="font-semibold text-xl mb-2">2. Tu choisis</h3>
              <p className="text-zinc-400">La pièce qui te parle. Tu lis l’histoire, tu écoutes la voix, tu imagines la chaleur.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Package className="w-8 h-8 text-rose-400" />
              </div>
              <h3 className="font-semibold text-xl mb-2">3. Tu reçois</h3>
              <p className="text-zinc-400">Le vêtement arrive chez toi avec son odeur, sa chaleur et son histoire personnelle.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
