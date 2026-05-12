import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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
      const supabase = await createClient();   // Client serveur

      for (const productId of productIds) {
        const { error } = await supabase.rpc('increment_sales_count', { 
          p_id: productId 
        });

        if (error) {
          console.error(`Erreur incrémentation sales_count pour ${productId}:`, error);
        } else {
          console.log(`✅ sales_count incrémenté pour produit ${productId}`);
        }
      }
    }
  }

  return new Response('OK', { status: 200 });
}
