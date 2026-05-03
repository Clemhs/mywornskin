// app/shop/page.tsx
'use client';

import { useState } from 'react';
import { ShoppingBag, Heart, Filter } from 'lucide-react';

const products = [
  {
    id: 1,
    name: "Culotte en dentelle noire portée 2 jours",
    price: 45,
    image: "/images/product1.jpg", // on ajoutera de vraies images plus tard
    creator: "Luna",
    wornDays: 2,
    likes: 12,
  },
  // Ajoute d'autres produits ici plus tard
];

export default function Shop() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">Boutique</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full">
            <Filter className="w-4 h-4" />
            <select 
              className="bg-transparent outline-none text-sm"
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Tout</option>
              <option value="lingerie">Lingerie</option>
              <option value="bas">Bas & Collants</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="group bg-zinc-900 rounded-3xl overflow-hidden card-hover border border-zinc-800">
            <div className="aspect-square bg-zinc-800 relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-black/70 text-xs px-3 py-1 rounded-full">
                {product.wornDays} jours
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-rose-400 text-sm">{product.creator}</p>
                  <h3 className="font-medium mt-1 line-clamp-2">{product.name}</h3>
                </div>
                <p className="text-xl font-semibold">{product.price}€</p>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="flex-1 bg-white text-black py-3 rounded-2xl font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Ajouter au panier
                </button>
                <button className="p-3 border border-zinc-700 rounded-2xl hover:border-rose-400 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
