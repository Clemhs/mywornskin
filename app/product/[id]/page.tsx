'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductClient({ product }: { product: any }) {
  const [selectedDuration, setSelectedDuration] = useState<'1j' | '2j'>('1j');

  const price = selectedDuration === '1j' ? 45 : 75;

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
      duration: selectedDuration === '1j' ? '1 journée' : '2 journées',
    };

    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    currentCart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(currentCart));

    alert(`✅ Ajouté au panier : ${product.title} - ${price}€`);
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
            {product.images?.slice(0, 5).map((img: string, i: number) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-zinc-700">
                <Image src={img} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Infos */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-light">{product.title}</h1>
            <p className="text-rose-400 mt-3 text-lg">
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
                  selectedDuration === '1j' ? 'border-rose-500 bg-rose-500/10' : 'border-zinc-700'
                }`}
              >
                1 journée — 45 €
              </button>
              <button
                onClick={() => setSelectedDuration('2j')}
                className={`flex-1 py-4 rounded-2xl border transition-all ${
                  selectedDuration === '2j' ? 'border-rose-500 bg-rose-500/10' : 'border-zinc-700'
                }`}
              >
                2 journées — 75 €
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6">
            <div>
              <p className="uppercase text-xs tracking-widest text-zinc-500 mb-2">DESCRIPTION</p>
              <p className="text-zinc-300 leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* Bouton */}
          <button
            onClick={handleAddToCart}
            className="w-full py-5 bg-white text-black rounded-2xl text-xl font-medium hover:bg-zinc-100 transition"
          >
            Ajouter au panier — {price} €
          </button>
        </div>
      </div>
    </div>
  );
}
