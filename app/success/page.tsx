'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const verifySubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = '/auth';
        return;
      }

      // On va juste afficher un message de succès pour l'instant
      // (le vrai enregistrement se fait via le webhook)
      setStatus('success');
    };

    verifySubscription();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-6"></div>
          <p>Vérification de ton abonnement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="max-w-md mx-auto px-6 text-center">
        <div className="mb-10">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">🎉</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">Merci !</h1>
          <p className="text-2xl text-green-400">Ton abonnement est actif</p>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-10 mb-10">
          <p className="text-gray-300 mb-8">
            Tu as maintenant accès au contenu exclusif, aux priorités messagerie et aux nouvelles pièces en avant-première.
          </p>
          
          <Link 
            href="/"
            className="block w-full bg-white text-black font-bold py-4 rounded-2xl text-lg hover:bg-gray-200 transition"
          >
            Retour à l'accueil
          </Link>
        </div>

        <p className="text-sm text-gray-500">
          Un email de confirmation t'a été envoyé.
        </p>
      </div>
    </div>
  );
}
