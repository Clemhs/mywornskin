import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Client Supabase avec Service Role Key (droits admin)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!   // ← Clé importante
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const productIds = JSON.parse(session.metadata?.productIds || '[]');

    if (productIds.length > 0) {
      for (const productId of productIds) {
        const { error } = await supabaseAdmin
          .rpc('increment_sales_count', { p_id: productId });

        if (error) {
          console.error(`Erreur incrémentation pour ${productId}:`, error);
        } else {
          console.log(`✅ sales_count incrémenté pour produit ${productId}`);
        }
      }
    }
  }

  return new Response('OK', { status: 200 });
}
