'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, [isLoggedIn, router]);

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleStripeCheckout = async () => {
    if (cartItems.length === 0) {
      setError("Le panier est vide");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cartItems,
          productIds: cartItems.map(item => item.id)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur serveur");
      }

      if (data.url) {
        // Vider le panier AVANT la redirection
        localStorage.removeItem('cart');
        window.location.href = data.url;
      } else {
        throw new Error("Aucune URL de paiement reçue");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Impossible de se connecter à Stripe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-2xl mx-auto px-6 pb-20">
        <h1 className="text-4xl font-light mb-10">Passer à la commande</h1>

        {error && (
          <div className="bg-red-900/30 border border-red-600 text-red-400 p-6 rounded-3xl mb-8">
            {error}
          </div>
        )}

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-10 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between py-4 border-b border-zinc-800 last:border-0">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-zinc-500">par {item.creator_name || 'Créatrice'}</p>
              </div>
              <p className="font-medium">{item.price} €</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-3xl font-light mb-10">
          <span>Total</span>
          <span className="text-rose-400">{total} €</span>
        </div>

        <button 
          onClick={handleStripeCheckout}
          disabled={loading || cartItems.length === 0}
          className="w-full py-7 bg-white text-black font-semibold text-xl rounded-3xl hover:bg-rose-400 hover:text-white transition-all disabled:opacity-70"
        >
          {loading ? "Connexion à Stripe..." : "Payer avec Stripe"}
        </button>

        <p className="text-center text-xs text-zinc-500 mt-6">
          Paiement sécurisé • Livraison discrète
        </p>
      </div>
    </main>
  );
}
