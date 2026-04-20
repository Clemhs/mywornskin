'use client';

import { useLanguage } from '../../context/LanguageContext';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function CreatorProfile() {
  const { t } = useLanguage();
  const { id } = useParams();

  // Données simulées des créateurs
  const creatorsData: any = {
    '1': {
      name: "Emma Laurent",
      avatar: "https://picsum.photos/id/64/400/400",
      bio: "Passionnée de lingerie fine, de photos intimes et de vêtements portés avec amour. Je partage tout avec vous.",
      subscribers: "2 450",
      price: "9,99",
      banner: "https://picsum.photos/id/1015/1200/400",
      items: [
        { id: 1, name: "Culotte noire portée 2 jours", price: "25", image: "https://picsum.photos/id/201/300/300" },
        { id: 2, name: "Soutien-gorge en dentelle", price: "35", image: "https://picsum.photos/id/202/300/300" },
        { id: 3, name: "Chaussettes hautes portées une semaine", price: "15", image: "https://picsum.photos/id/203/300/300" },
      ]
    },
    '2': {
      name: "Sophie Moreau",
      avatar: "https://picsum.photos/id/65/400/400",
      bio: "J’adore porter mes vêtements longtemps et les rendre uniques pour vous. Sensualité et authenticité.",
      subscribers: "1 820",
      price: "12,99",
      banner: "https://picsum.photos/id/1016/1200/400",
      items: [
        { id: 1, name: "Jean slim porté 5 jours", price: "45", image: "https://picsum.photos/id/204/300/300" },
        { id: 2, name: "T-shirt blanc intime", price: "20", image: "https://picsum.photos/id/205/300/300" },
      ]
    },
    '3': {
      name: "Léa Dubois",
      avatar: "https://picsum.photos/id/66/400/400",
      bio: "Sportive et sensuelle. Je porte tout pour vous : leggings, chaussettes, sous-vêtements...",
      subscribers: "3 120",
      price: "8,99",
      banner: "https://picsum.photos/id/1018/1200/400",
      items: []
    }
  };

  const creator = creatorsData[id as string] || creatorsData['1'];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Banner */}
      <div className="relative h-80 md:h-96">
        <Image 
          src={creator.banner} 
          alt={creator.name} 
          fill 
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black" />
      </div>

      <div className="max-w-5xl mx-auto -mt-20 relative px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar + Info */}
          <div className="flex-shrink-0 text-center md:text-left">
            <Image 
              src={creator.avatar} 
              alt={creator.name} 
              width={180} 
              height={180} 
              className="rounded-3xl border-4 border-zinc-900 mx-auto md:mx-0" 
            />
            <h1 className="text-4xl font-bold mt-6">{creator.name}</h1>
            <p className="text-emerald-400 mt-1">• En ligne maintenant</p>
            <p className="text-gray-400 mt-1">{creator.subscribers} abonnés</p>
          </div>

          {/* Bio & Abonnement */}
          <div className="flex-1 mt-8 md:mt-12">
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              {creator.bio}
            </p>

            <div className="bg-zinc-900 rounded-3xl p-8">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-sm text-gray-400">Abonnement mensuel</p>
                  <p className="text-5xl font-bold text-rose-400">{creator.price} €</p>
                </div>
                <button className="bg-rose-600 hover:bg-rose-500 px-10 py-4 rounded-2xl font-semibold text-lg transition">
                  S’abonner à {creator.name}
                </button>
              </div>
              <p className="text-sm text-gray-400">Accès à toutes ses photos exclusives + messagerie privée</p>
            </div>
          </div>
        </div>

        {/* Articles en vente */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Articles en vente</h2>
          
          {creator.items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {creator.items.map((item: any) => (
                <div key={item.id} className="bg-zinc-900 rounded-3xl overflow-hidden group">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    width={400} 
                    height={300} 
                    className="w-full aspect-[4/3] object-cover" 
                  />
                  <div className="p-6">
                    <h3 className="font-medium text-lg mb-2">{item.name}</h3>
                    <p className="text-2xl font-bold text-rose-400">{item.price} €</p>
                    <button className="mt-6 w-full bg-zinc-800 hover:bg-zinc-700 py-3 rounded-2xl text-sm font-medium transition">
                      Acheter cet article
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-12">Aucun article en vente pour le moment...</p>
          )}
        </div>
      </div>
    </div>
  );
}
