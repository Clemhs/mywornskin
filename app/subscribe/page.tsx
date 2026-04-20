'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SubscribePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/auth');
      else setUser(user);
    };
    checkUser();
  }, [router]);

  const handleSubscribe = async () => {
    setLoading(true);
    // Pour l'instant on simule un abonnement mensuel à 9.99€
    // Plus tard on connectera vraiment Stripe

    alert("Simulation : Abonnement mensuel activé à 9.99€/mois !\n\nDans la vraie version, Stripe sera intégré ici.");

    // Exemple de ce qu'on fera plus tard :
    // const { error } = await supabase.from('subscriptions').insert({
    //   user_id: user.id,
    //   creator_id: "...",
    //   amount: 9.99,
    //   status: 'active'
    // });

    setLoading(false);
  };

  if (!user) return <div className="text-center py-20">Redirection...</div>;

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-md mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold mb-6">Abonnements</h1>
        <p className="text-gray-400 mb-12">
          Soutiens tes créatrices préférées et accède à du contenu exclusif
        </p>

        <div className="bg-zinc-900 rounded-3xl p-10">
          <div className="text-5xl font-bold mb-2">9,99 €</div>
          <p className="text-gray-400 mb-8">par mois</p>

          <ul className="text-left space-y-4 mb-10 text-sm">
            <li>✓ Accès prioritaire aux nouvelles pièces</li>
            <li>✓ Photos et vidéos exclusives</li>
            <li>✓ Messagerie prioritaire</li>
            <li>✓ Contenu personnalisé</li>
          </ul>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl text-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? "Activation..." : "S'abonner maintenant"}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-8">
          Paiement sécurisé via Stripe (à venir)
        </p>
      </div>
    </div>
  );
}
