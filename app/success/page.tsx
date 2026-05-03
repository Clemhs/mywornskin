'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20">
      <Header />
      
      <div className="max-w-md mx-auto px-6 pt-32 text-center pb-20">
        <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-8" />
        
        <h1 className="text-5xl font-light mb-4">Commande confirmée !</h1>
        
        <p className="text-zinc-400 text-lg mb-12">
          Merci pour votre confiance.<br />
          Vous allez recevoir un email de confirmation.
        </p>

        <Link 
          href="/shop"
          className="block w-full py-5 bg-rose-500 hover:bg-rose-600 rounded-3xl text-lg font-medium transition-all"
        >
          Retour à la boutique
        </Link>
      </div>
    </main>
  );
}
