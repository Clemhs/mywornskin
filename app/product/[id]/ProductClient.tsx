'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Volume2, Heart, Share2 } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

export default function ProductClient({ product }: { product: any }) {
  const router = useRouter();
  const { user, isCreator } = useAuth();

  const [currentImage, setCurrentImage] = useState(0);
  const [selectedDays, setSelectedDays] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  const totalPrice = (product.price || 0) * selectedDays;
  const isOwner = user && product.creator_id === user.id;

  return (
    <main className="min-h-screen bg-zinc-950 pb-20">
      {/* Header fixe */}
      <div className="fixed top-0 left-0 right-0 bg-zinc-950 border-b border-zinc-800 z-40">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft size={20} /> Retour
          </button>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:text-rose-400">
              <Heart size={22} className={isFavorited ? "fill-current text-rose-500" : ""} />
            </button>
            <button className="p-2 hover:text-rose-400">
              <Share2 size={22} />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-20 max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Galerie images */}
          <div>
            <div className="aspect-square bg-zinc-900 rounded-3xl overflow-hidden mb-4">
              <img 
                src={product.images?.[currentImage] || product.image} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img: string, i: number) => (
                  <img 
                    key={i}
                    src={img}
                    onClick={() => setCurrentImage(i)}
                    className={`w-20 h-20 object-cover rounded-2xl cursor-pointer border-2 ${currentImage === i ? 'border-rose-500' : 'border-transparent'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Infos produit */}
          <div>
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <p className="text-rose-400 text-xl mt-1">par {product.creator?.full_name}</p>

            <div className="mt-8">
              <h3 className="uppercase text-xs tracking-widest text-zinc-500 mb-3">Tarification</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedDays(1)}
                  className={`flex-1 py-4 rounded-2xl border ${selectedDays === 1 ? 'border-rose-500 bg-rose-500/10' : 'border-zinc-700'}`}
                >
                  1 journée — {product.price} €
                </button>
                {product.price_2days && (
                  <button
                    onClick={() => setSelectedDays(2)}
                    className={`flex-1 py-4 rounded-2xl border ${selectedDays === 2 ? 'border-rose-500 bg-rose-500/10' : 'border-zinc-700'}`}
                  >
                    2 journées — {product.price_2days} €
                  </button>
                )}
              </div>
            </div>

            <div className="mt-10">
              <h3 className="uppercase text-xs tracking-widest text-zinc-500 mb-3">Histoire intime</h3>
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{product.story}</p>
            </div>

            <div className="mt-10">
              <h3 className="uppercase text-xs tracking-widest text-zinc-500 mb-3">Description</h3>
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>

            {!isOwner ? (
              <button className="mt-12 w-full py-7 bg-white text-black font-semibold text-xl rounded-3xl hover:bg-rose-400 hover:text-white transition-all">
                Ajouter au panier — {totalPrice} €
              </button>
            ) : (
              <p className="text-center py-8 text-zinc-500">Ceci est votre propre produit</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
