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
    console.error('Webhook signature failed:', err.message);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`Webhook reçu : ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const supabase = await createClient();

      await supabase.from('orders').insert({
        user_id: session.metadata?.user_id,
        stripe_session_id: session.id,
        amount: session.amount_total,
        status: 'paid',
        customer_email: session.customer_email,
        customer_name: session.customer_details?.name || '',
        items: session.line_items?.data || [],
      });

      console.log(`Commande sauvegardée : ${session.id}`);
    } catch (err) {
      console.error("Erreur sauvegarde :", err);
    }
  }

  return Response.json({ received: true });
}

// Pour éviter le 405
export async function GET() {
  return Response.json({ message: "Webhook Stripe actif" });
}
