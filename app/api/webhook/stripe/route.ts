import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    console.log(`🔥 WEBHOOK REÇU`);
  } catch (err: any) {
    console.error("❌ Signature error:", err.message);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const supabase = await createClient();

      const { error } = await supabase.from('orders').insert({
        user_id: session.metadata?.user_id,
        product_id: 1,  // fallback obligatoire
        stripe_session_id: session.id,
        amount: session.amount_total || 0,
        status: 'paid',
        customer_email: session.customer_email,
        customer_name: session.customer_details?.name || '',
        items: [{ 
          title: "Commande Stripe", 
          price: session.amount_total ? session.amount_total / 100 : 0, 
          quantity: 1 
        }]
      });

      if (error) {
        console.error("❌ INSERT ERROR:", error);
      } else {
        console.log("✅ COMMANDE ENREGISTRÉE (version minimale)");
      }
    } catch (err: any) {
      console.error("💥 Erreur webhook:", err);
    }
  }

  return Response.json({ received: true });
}
