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
  } catch (err: any) {
    console.error("Signature failed:", err.message);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const supabase = await createClient();

      // Version ultra-simple pour tester
      const items = [{
        title: session.metadata?.product_title || "Produit commandé",
        price: (session.amount_total || 0) / 100,
        quantity: 1,
      }];

      const { error } = await supabase.from('orders').insert({
        user_id: session.metadata?.user_id,
        product_id: session.metadata?.product_id || null,
        stripe_session_id: session.id,
        amount: session.amount_total,
        status: 'paid',
        customer_email: session.customer_email,
        customer_name: session.customer_details?.name || '',
        items: items,
      });

      if (error) {
        console.error("Insert error:", error);
      } else {
        console.log("✅ Commande créée avec succès (version simple)");
      }
    } catch (err) {
      console.error("Webhook error:", err);
    }
  }

  return Response.json({ received: true });
}
