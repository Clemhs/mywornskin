import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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
        try {
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/increment_sales_count`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseServiceKey,
              'Authorization': `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({ p_id: productId }),
          });

          if (response.ok) {
            console.log(`✅ sales_count incrémenté pour produit ${productId}`);
          } else {
            console.error(`❌ Erreur RPC pour ${productId}:`, await response.text());
          }
        } catch (err) {
          console.error(`Erreur réseau pour ${productId}:`, err);
        }
      }
    }
  }

  return new Response('OK', { status: 200 });
}
