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

    console.log("💰 Paiement réussi - Session:", session.id);
    console.log("👤 User ID:", session.metadata?.user_id);

    try {
      const supabase = await createClient();

      const items = (session.line_items?.data || []).map((item: any) => ({
        title: item.description || "Produit",
        price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
        quantity: item.quantity || 1,
      }));

      const { error } = await supabase.from('orders').insert({
        user_id: session.metadata?.user_id,
        stripe_session_id: session.id,
        amount: session.amount_total,
        status: 'paid',
        customer_email: session.customer_email,
        customer_name: session.customer_details?.name || '',
        items: items,
      });

      if (error) {
        console.error("❌ Erreur Supabase:", error);
      } else {
        console.log("🎉 COMMANDE CRÉÉE AVEC SUCCÈS !");
      }
    } catch (err) {
      console.error("💥 Erreur générale:", err);
    }
  }

  return Response.json({ received: true });
}
