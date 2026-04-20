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
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const monthlyPriceId = 'price_1TOI3sBnvnJqvQspTEI77qKP';
  const yearlyPriceId = 'price_1TOLRUBnvnJqvQspKbQci01B';

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth';
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, []);

  const handleSubscribe = async () => {
    if (!user) return;

    setLoading(true);

    const priceId = selectedPlan === 'monthly' ? monthlyPriceId : yearlyPriceId;

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe n'a pas chargé");

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: priceId,
          userId: user.id
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) throw new Error(error);

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

      if (stripeError) throw stripeError;

    } catch (error: any) {
      alert("Erreur : " + error.message);
    }

    setLoading(false);
  };

  if (!user) {
    return <div className="text-center py-20 text-white">Redirection...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-md mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold mb-6">Choisis ton abonnement</h1>
        <p className="text-gray-400 mb-10">Soutiens tes créateurs préférés</p>

        <div className="space-y-4 mb-10">
          {/* Abonnement Mensuel */}
          <div 
            onClick={() => setSelectedPlan('monthly')}
            className={`bg-zinc-900 rounded-3xl p-6 cursor-pointer transition border-2 ${selectedPlan === 'monthly' ? 'border-white' : 'border-transparent'}`}
          >
            <div className="text-4xl font-bold">9,99 €</div>
            <p className="text-gray-400">par mois</p>
            <ul className="text-left text-sm mt-6 space-y-2">
              <li>✓ Accès aux photos exclusives</li>
              <li>✓ Priorité sur les nouvelles pièces</li>
              <li>✓ Messagerie prioritaire</li>
              <li>✓ Contenu personnalisé</li>
            </ul>
          </div>

          {/* Abonnement Annuel */}
          <div 
            onClick={() => setSelectedPlan('yearly')}
            className={`bg-zinc-900 rounded-3xl p-6 cursor-pointer transition border-2 ${selectedPlan === 'yearly' ? 'border-white' : 'border-transparent'}`}
          >
            <div className="text-4xl font-bold">99 €</div>
            <p className="text-gray-400">par an</p>
            <p className="text-green-400 text-sm mt-1">Économise ~17 %</p>
            <ul className="text-left text-sm mt-6 space-y-2">
              <li>✓ Tout du mensuel</li>
              <li>✓ Accès prioritaire aux nouveautés</li>
              <li>✓ Badge "Abonné Annuel"</li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full bg-white text-black font-bold py-4 rounded-2xl text-lg hover:bg-gray-200 disabled:opacity-50 transition"
        >
          {loading ? "Redirection vers Stripe..." : `S'abonner ${selectedPlan === 'monthly' ? 'mensuellement' : 'annuellement'}`}
        </button>

        <p className="text-xs text-gray-500 mt-8">
          Paiement sécurisé via Stripe • Annulation possible à tout moment
        </p>
      </div>
    </div>
  );
}
