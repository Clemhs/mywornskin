// app/api/stripe/webhook/route.ts
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, { status: 400 });
  }

  // === Gestion de la commande réussie ===
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Récupérer l'ID du produit acheté (tu dois l'avoir passé en metadata lors de la création de la session)
    const productId = session.metadata?.product_id;

    if (productId) {
      const supabase = createClient();

      const { error } = await supabase
        .from('products')
        .rpc('increment_sales_count', { p_id: productId });

      if (error) {
        console.error("Erreur incrémentation sales_count:", error);
      } else {
        console.log(`✅ sales_count incrémenté pour le produit ${productId}`);
      }
    }
  }

  return new Response('OK', { status: 200 });
}
