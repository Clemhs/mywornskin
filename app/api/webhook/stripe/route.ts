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
    console.error("❌ Signature error:", err.message);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const supabase = await createClient();

      const lineItemsData = await stripe.checkout.sessions.listLineItems(session.id);
      const items = lineItemsData.data.map((item: any) => ({
        title: item.description || "Produit",
        price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
        quantity: item.quantity || 1,
      }));

      const { error } = await supabase.from('orders').insert({
        user_id: session.metadata?.user_id,
        product_id: 1,
        stripe_session_id: session.id,
        amount: session.amount_total || 0,
        status: 'paid',
        customer_email: session.customer_email,
        customer_name: session.customer_details?.name || '',
        items: items.length > 0 ? items : [{ title: "Commande", price: session.amount_total ? session.amount_total / 100 : 0, quantity: 1 }]
      });

      if (error) console.error("❌ INSERT ERROR:", error);
      else console.log("✅ COMMANDE ENREGISTRÉE (version stable)");

    } catch (err: any) {
      console.error("💥 Erreur webhook:", err);
    }
  }

  return Response.json({ received: true });
}
