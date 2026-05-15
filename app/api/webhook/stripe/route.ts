import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  console.log("🔥 WEBHOOK REÇU à", new Date().toISOString());

  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    console.error('❌ Signature error:', err.message);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log("✅ Event type :", event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("💰 Session ID :", session.id);
    console.log("👤 User ID :", session.metadata?.user_id || "MANQUANT");

    try {
      const supabase = await createClient();

      await supabase.from('orders').insert({
        user_id: session.metadata?.user_id,
        stripe_session_id: session.id,
        amount: session.amount_total || 0,
        status: 'paid',
        customer_email: session.customer_email,
        customer_name: session.customer_details?.name || '',
        items: [{ title: "Produit test webhook", price: 45, quantity: 1 }]
      });

      console.log("🎉 COMMANDE INSÉRÉE AVEC SUCCÈS !");
    } catch (err) {
      console.error("💥 Erreur insertion :", err);
    }
  }

  return Response.json({ received: true });
}
