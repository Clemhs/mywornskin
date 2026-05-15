'use client';

import { useState } from 'react';

export default function ProductPage({ product }: { product: any }) {
  const [selectedTarif, setSelectedTarif] = useState(0); // 0 = 1 jour, 1 = 2 jours, etc.

  const tarifs = [
    { label: "1 journée", price: 45 },
    { label: "2 journées", price: 75 },
    // Ajoute d'autres durées si besoin
  ];

  const currentPrice = tarifs[selectedTarif].price;

  const addToCart = () => {
    const item = {
      id: product.id,
      title: product.title,
      price: currentPrice,           // ← Important : on prend le bon prix
      images: product.images,
      description: product.description,
      creator_name: product.creator?.full_name,
      creatorSlug: product.creator?.username,
      quantity: 1,
      duration: tarifs[selectedTarif].label,
    };

    // Ton code existant pour ajouter au panier (localStorage ou context)
    // ...
    console.log("Ajouté au panier :", item);
  };

  return (
    <>
      {/* ... reste de ta page ... */}

      {/* Tarifs */}
      <div className="flex gap-3 mt-6">
        {tarifs.map((tarif, index) => (
          <button
            key={index}
            onClick={() => setSelectedTarif(index)}
            className={`px-6 py-3 rounded-full border transition-all ${
              selectedTarif === index 
                ? 'border-rose-500 bg-rose-500/10 text-white' 
                : 'border-zinc-700 hover:border-zinc-600'
            }`}
          >
            {tarif.label} — {tarif.price} €
          </button>
        ))}
      </div>

      {/* Bouton Ajouter au panier */}
      <button
        onClick={addToCart}
        className="w-full mt-6 py-4 bg-white text-black rounded-full font-medium text-lg"
      >
        Ajouter au panier — {currentPrice} €
      </button>
    </>
  );
}
