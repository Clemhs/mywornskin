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

      // Récupérer les vrais line_items (Stripe ne les envoie pas toujours dans l'event)
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items.data.price.product']
      });

      const lineItems = sessionWithLineItems.line_items?.data || [];

      // Enrichissement complet
      const enrichedItems = lineItems.map((item: any) => ({
        title: item.description || item.price?.product?.name || "Produit",
        price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
        quantity: item.quantity || 1,
        images: item.price?.product?.images || [],
        description: "", // on peut enrichir plus tard
      }));

      const productId = lineItems[0]?.price?.metadata?.product_id || null;

      const { error } = await supabase.from('orders').insert({
        user_id: session.metadata?.user_id,
        product_id: productId,
        stripe_session_id: session.id,
        amount: session.amount_total,
        status: 'paid',
        customer_email: session.customer_email,
        customer_name: session.customer_details?.name || '',
        items: enrichedItems,
      });

      if (error) {
        console.error("❌ Erreur insert:", error);
      } else {
        console.log(`🎉 Commande créée avec ${enrichedItems.length} item(s)`);
      }
    } catch (err) {
      console.error("💥 Erreur webhook:", err);
    }
  }

  return Response.json({ received: true });
}
