'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductClient({ product }: { product: any }) {
  const [selectedDuration, setSelectedDuration] = useState<'1j' | '2j'>('1j');

  const price = selectedDuration === '1j' ? 45 : 75;
  const durationLabel = selectedDuration === '1j' ? '1 journée' : '2 journées';

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      title: product.title,
      price: price,
      images: product.images,
      description: product.description,
      creator_name: product.creator?.full_name || product.creator?.username,
      creatorSlug: product.creator?.username,
      quantity: 1,
      duration: durationLabel,
    };

    // Système simple avec localStorage (fonctionne partout)
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    currentCart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(currentCart));

    alert('✅ Produit ajouté au panier !');
    // Tu peux aussi faire un toast plus joli plus tard
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square relative rounded-3xl overflow-hidden bg-zinc-900">
            <Image
              src={product.images?.[0] || '/default-avatar.png'}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex gap-4 mt-6">
            {product.images?.map((img: string, i: number) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-zinc-700">
                <Image src={img} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Contenu */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-light">{product.title}</h1>
            <p className="text-rose-400 mt-2">
              par {product.creator?.full_name || product.creator?.username || 'Créatrice'}
            </p>
          </div>

          {/* Tarifs */}
          <div>
            <p className="uppercase text-xs tracking-widest text-zinc-500 mb-3">TARIFICATION</p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedDuration('1j')}
                className={`flex-1 py-4 rounded-2xl border transition-all ${
                  selectedDuration === '1j' 
                    ? 'border-rose-500 bg-rose-500/10 text-white' 
                    : 'border-zinc-700 hover:border-zinc-600'
                }`}
              >
                1 journée — 45 €
              </button>

              <button
                onClick={() => setSelectedDuration('2j')}
                className={`flex-1 py-4 rounded-2xl border transition-all ${
                  selectedDuration === '2j' 
                    ? 'border-rose-500 bg-rose-500/10 text-white' 
                    : 'border-zinc-700 hover:border-zinc-600'
                }`}
              >
                2 journées — 75 €
              </button>
            </div>
          </div>

          {/* Histoire & Description */}
          <div className="space-y-6 text-zinc-300">
            <div>
              <p className="uppercase text-xs tracking-widest text-zinc-500 mb-2">HISTOIRE INTIME</p>
              <p>{product.histoire_intime || 'Aucune histoire intime renseignée.'}</p>
            </div>
            <div>
              <p className="uppercase text-xs tracking-widest text-zinc-500 mb-2">DESCRIPTION</p>
              <p>{product.description}</p>
            </div>
          </div>

          {/* Bouton Panier */}
          <button
            onClick={handleAddToCart}
            className="w-full py-5 bg-white text-black rounded-2xl text-xl font-medium hover:bg-zinc-200 transition-all"
          >
            Ajouter au panier — {price} €
          </button>
        </div>
      </div>
    </div>
  );
}
