'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SubscribePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = '/auth';
      else setUser(user);
    };
    checkUser();
  }, []);

  const handleSubscribe = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: 'price_1TOI3sBnvnJqvQspTEI77qKP', // ton Price ID
          userId: user.id
        }),
      });

      const { sessionId } = await response.json();

      const stripe = await stripePromise;
      if (stripe) {
        stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      alert("Erreur lors de la création de la session de paiement");
    }

    setLoading(false);
  };

  if (!user) return <div className="text-center py-20">Chargement...</div>;

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-md mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold mb-6">Abonnement Mensuel</h1>
        <p className="text-gray-400 mb-10">
          Soutiens tes créateurs préférés et accède à du contenu exclusif
        </p>

        <div className="bg-zinc-900 rounded-3xl p-10">
          <div className="text-5xl font-bold mb-2">9,99 €</div>
          <p className="text-gray-400 mb-8">par mois</p>

          <ul className="text-left space-y-4 mb-12 text-sm">
            <li>✓ Accès aux photos exclusives</li>
            <li>✓ Priorité sur les nouvelles pièces</li>
            <li>✓ Messagerie prioritaire</li>
            <li>✓ Contenu personnalisé</li>
          </ul>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl text-lg hover:bg-gray-200 disabled:opacity-50 transition"
          >
            {loading ? "Redirection vers le paiement..." : "S'abonner maintenant"}
          </button>
        </div>
      </div>
    </div>
  );
}
