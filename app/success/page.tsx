import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { notFound } from 'next/navigation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    notFound();
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'customer']
    });
  } catch (error) {
    console.error("Erreur récupération session Stripe:", error);
    return (
      <div className="min-h-screen bg-zinc-950 text-white pt-20 text-center">
        <p className="text-red-400">Erreur lors de la récupération de la commande.</p>
      </div>
    );
  }

  const lineItems = session.line_items?.data || [];
  const totalAmount = (session.amount_total || 0) / 100;

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="max-w-2xl mx-auto px-6 pt-20 pb-20 text-center">
        <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-8" />
        
        <h1 className="text-5xl font-light mb-4">Commande confirmée !</h1>
        <p className="text-zinc-400 text-lg mb-12">
          Merci pour votre achat.<br />
          Un email de confirmation vous a été envoyé.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-10 text-left">
          <h2 className="text-xl font-medium mb-6">Détails de la commande</h2>
          
          {lineItems.map((item: any) => (
            <div key={item.id} className="flex justify-between py-4 border-b border-zinc-800 last:border-0">
              <div>
                <p className="font-medium">{item.description}</p>
                <p className="text-sm text-zinc-500">Quantité : {item.quantity}</p>
              </div>
              <p className="font-medium">€{(item.amount_total / 100).toFixed(2)}</p>
            </div>
          ))}

          <div className="flex justify-between text-2xl font-light mt-8 pt-6 border-t border-zinc-700">
            <span>Total payé</span>
            <span className="text-rose-400">€{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Link 
            href="/profile/orders"
            className="block w-full py-5 bg-white text-black font-semibold rounded-3xl hover:bg-zinc-200 transition-all"
          >
            Voir mes commandes
          </Link>

          <Link 
            href="/shop"
            className="block w-full py-5 border border-zinc-700 hover:bg-zinc-900 rounded-3xl font-medium transition-all"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    </main>
  );
}
