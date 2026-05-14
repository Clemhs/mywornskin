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
    console.log(`✅ Webhook OK - Type: ${event.type}`);
  } catch (err: any) {
    console.error('❌ Signature invalide:', err.message);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`💰 Session terminée - ID: ${session.id} | User ID: ${session.metadata?.user_id}`);

    try {
      const supabase = await createClient();

      const { error } = await supabase.from('orders').insert({
        user_id: session.metadata?.user_id,
        stripe_session_id: session.id,
        amount: session.amount_total,
        status: 'paid',
        customer_email: session.customer_email,
        customer_name: session.customer_details?.name || '',
        items: session.line_items?.data || [],
      });

      if (error) {
        console.error("❌ Erreur insertion ordre :", error);
      } else {
        console.log("✅ Commande sauvegardée avec succès !");
      }
    } catch (err) {
      console.error("❌ Exception lors de l'insertion :", err);
    }
  }

  return Response.json({ received: true });
}
