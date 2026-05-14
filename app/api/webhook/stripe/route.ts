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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const supabase = await createClient();

      // Récupérer les vrais produits depuis la base pour avoir toutes les infos
      const productIds = session.line_items?.data.map(item => 
        item.price?.metadata?.product_id
      ).filter(Boolean);

      let fullItems = session.line_items?.data || [];

      // Optionnel : enrichir avec les données complètes
      if (productIds && productIds.length > 0) {
        const { data: products } = await supabase
          .from('products')
          .select('id, title, description, images, creator_id, creator:profiles(username, full_name)')
          .in('id', productIds);

        // Ici on pourrait merger, mais pour simplifier on garde ce qu'on a déjà
      }

      await supabase.from('orders').insert({
        user_id: session.metadata?.user_id,
        stripe_session_id: session.id,
        amount: session.amount_total,
        status: 'paid',
        customer_email: session.customer_email,
        customer_name: session.customer_details?.name || '',
        items: fullItems,
      });

      console.log(`✅ Commande sauvegardée : ${session.id}`);
    } catch (err) {
      console.error("Erreur sauvegarde :", err);
    }
  }

  return Response.json({ received: true });
}
