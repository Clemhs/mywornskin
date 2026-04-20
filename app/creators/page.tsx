'use client';

import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CreatorsPage() {
  const { t } = useLanguage();

  const creators = [
    {
      id: 1,
      name: "Emma Laurent",
      avatar: "https://picsum.photos/id/64/300/300",
      bio: "Passionnée de lingerie fine et de photos intimes",
      subscribers: "2.4k",
      price: "9,99",
      featured: true,
    },
    {
      id: 2,
      name: "Sophie Moreau",
      avatar: "https://picsum.photos/id/65/300/300",
      bio: "Vêtements portés quotidiennement, très sensuelle",
      subscribers: "1.8k",
      price: "12,99",
      featured: false,
    },
    {
      id: 3,
      name: "Léa Dubois",
      avatar: "https://picsum.photos/id/66/300/300",
      bio: "Spécialisée dans les tenues sportives et intimes",
      subscribers: "3.1k",
      price: "8,99",
      featured: false,
    },
    {
      id: 4,
      name: "Chloé Martin",
      avatar: "https://picsum.photos/id/67/300/300",
      bio: "Je porte tout pour vous… même mes collants",
      subscribers: "987",
      price: "11,99",
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4">
            Découvrez nos créatrices
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Abonnez-vous à vos créatrices préférées et accédez à leur contenu exclusif
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {creators.map((creator) => (
            <Link key={creator.id} href={`/creators/${creator.id}`} className="group">
              <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-rose-600 transition-all duration-300 hover:-translate-y-2">
                <div className="relative">
                  <Image 
                    src={creator.avatar} 
                    alt={creator.name} 
                    width={400} 
                    height={400} 
                    className="w-full aspect-square object-cover" 
                  />
                  {creator.featured && (
                    <div className="absolute top-4 right-4 bg-rose-600 text-xs font-bold px-4 py-1 rounded-full">
                      Populaire
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-semibold group-hover:text-rose-400 transition-colors">
                      {creator.name}
                    </h3>
                    <div className="text-right">
                      <p className="text-sm text-emerald-400">• En ligne</p>
                      <p className="text-xs text-gray-500">{creator.subscribers} abonnés</p>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                    {creator.bio}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-rose-400">{creator.price}€</span>
                      <span className="text-xs text-gray-500"> / mois</span>
                    </div>
                    <button className="bg-rose-600 hover:bg-rose-500 px-6 py-2.5 rounded-2xl text-sm font-medium transition">
                      Voir le profil
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16 text-gray-500 text-sm">
          Plus de créatrices arrivent bientôt...
        </div>
      </div>
    </div>
  );
}
