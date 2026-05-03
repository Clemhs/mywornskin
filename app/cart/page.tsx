'use client';

import Link from 'next/link';
import { ArrowLeft, Trash2, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  const removeFromCart = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const goToCheckout = () => {
    if (cartItems.length > 0) {
      router.push('/checkout');
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <Link href="/shop" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-10">
          <ArrowLeft className="w-5 h-5" /> Retour à la boutique
        </Link>

        <div className="flex items-center gap-4 mb-10">
          <ShoppingBag className="w-9 h-9 text-rose-400" />
          <h1 className="text-5xl font-light tracking-tight">Mon Panier</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-32">
            <ShoppingBag className="w-24 h-24 mx-auto text-zinc-700 mb-6" />
            <h2 className="text-3xl font-light mb-4">Votre panier est vide</h2>
            <p className="text-zinc-400 mb-10">Découvrez nos pièces uniques dans la boutique</p>
            <Link 
              href="/shop" 
              className="inline-block px-12 py-5 bg-rose-500 hover:bg-rose-600 rounded-3xl text-lg font-medium"
            >
              Aller à la boutique
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-12">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex gap-6 items-center">
                  <div className="w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-medium truncate">{item.title}</h3>
                    <p className="text-rose-400 mt-1">{item.price} €</p>
                    <p className="text-sm text-zinc-400 mt-1">par {item.creator_name || 'Créatrice'}</p>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-zinc-500 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="flex justify-between items-center text-3xl font-light mb-10">
                <span>Total</span>
                <span className="text-rose-400 font-semibold">{total} €</span>
              </div>

              <button 
                onClick={goToCheckout}
                className="w-full py-7 bg-white text-black font-semibold text-xl rounded-3xl hover:bg-rose-400 hover:text-white transition-all"
              >
                Passer à la commande
              </button>

              <p className="text-center text-xs text-zinc-500 mt-6">
                Paiement sécurisé • Livraison discrète
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
