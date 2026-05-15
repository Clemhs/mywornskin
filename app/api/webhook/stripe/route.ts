import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  console.log("🔥 WEBHOOK REÇU");

  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    console.error("❌ Signature error:", err.message);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("💰 Session:", session.id);
    console.log("Amount:", session.amount_total);
    console.log("User ID:", session.metadata?.user_id);

    try {
      const supabase = await createClient();

      const { error } = await supabase.from('orders').insert({
        user_id: session.metadata?.user_id,
        stripe_session_id: session.id,
        amount: session.amount_total || 0,
        status: 'paid',
        customer_email: session.customer_email,
        items: [{
          title: "Produit payé",
          price: (session.amount_total || 0) / 100,
          quantity: 1
        }]
      });

      if (error) console.error("Insert error:", error);
      else console.log("🎉 COMMANDE CRÉÉE !");
    } catch (err) {
      console.error("Erreur:", err);
    }
  }

  return Response.json({ received: true });
}
