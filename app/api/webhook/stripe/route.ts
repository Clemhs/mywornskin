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

      // Récupérer les IDs des produits
      const productIds = session.line_items?.data
        .map(item => item.price?.metadata?.product_id)
        .filter(Boolean) || [];

      // Récupérer les vraies infos des produits
      let enrichedItems = session.line_items?.data || [];

      if (productIds.length > 0) {
        const { data: products } = await supabase
          .from('products')
          .select(`
            id, 
            title, 
            description, 
            images, 
            price,
            creator_id,
            creator:profiles!creator_id (username, full_name)
          `)
          .in('id', productIds);

        // Enrichir les items avec les vraies données
        enrichedItems = session.line_items?.data.map((item: any) => {
          const product = products?.find(p => p.id === item.price?.metadata?.product_id);
          return {
            ...item,
            title: product?.title || item.description,
            description: product?.description,
            images: product?.images,
            creator_name: product?.creator?.full_name,
            creatorSlug: product?.creator?.username,
          };
        }) || [];
      }

      await supabase.from('orders').insert({
        user_id: session.metadata?.user_id,
        stripe_session_id: session.id,
        amount: session.amount_total,
        status: 'paid',
        customer_email: session.customer_email,
        customer_name: session.customer_details?.name || '',
        items: enrichedItems,
      });

      console.log(`✅ Commande complète sauvegardée : ${session.id}`);
    } catch (err) {
      console.error("Erreur sauvegarde commande :", err);
    }
  }

  return Response.json({ received: true });
}
