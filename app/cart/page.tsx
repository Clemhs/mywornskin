// app/cart/page.tsx
'use client';

export default function CartPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-semibold mb-10">Mon Panier</h1>
      
      <div className="bg-zinc-900 rounded-3xl p-8">
        <p className="text-zinc-400 text-center py-20">Votre panier est vide pour l'instant...</p>
      </div>

      <div className="mt-8 flex justify-end">
        <button className="bg-white text-black px-10 py-4 rounded-2xl font-medium">
          Passer à la caisse
        </button>
      </div>
    </div>
  );
}
