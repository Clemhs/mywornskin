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
      const lineItems = lineItemsData.data || [];

      const productIds = lineItems
        .map((item: any) => item.price?.metadata?.product_id)
        .filter(Boolean);

      let enrichedItems: any[] = [];

      if (productIds.length > 0) {
        const { data: products } = await supabase
          .from('products')
          .select(`
            id, title, description, images,
            creator:profiles!creator_id (full_name, username)
          `)
          .in('id', productIds);

        enrichedItems = lineItems.map((item: any) => {
          const product = products?.find(p => String(p.id) === String(item.price?.metadata?.product_id));
          const creator = product?.creator?.[0];

          return {
            title: product?.title || item.description || "Produit",
            description: product?.description || "Pas de description disponible",
            images: product?.images || [],
            price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
            quantity: item.quantity || 1,
            creator_name: creator?.full_name || "Créatrice",
            creatorSlug: creator?.username || "",
          };
        });
      }

      const { error } = await supabase.from('orders').insert({
        user_id: session.metadata?.user_id,
        product_id: productIds[0] || null,
        stripe_session_id: session.id,
        amount: session.amount_total || 0,
        status: 'paid',
        customer_email: session.customer_email,
        customer_name: session.customer_details?.name || '',
        items: enrichedItems.length > 0 ? enrichedItems : [{
          title: "Produit",
          description: "Pas de description disponible",
          images: [],
          price: session.amount_total ? session.amount_total / 100 : 0,
          quantity: 1,
          creator_name: "Créatrice",
          creatorSlug: "",
        }]
      });

      if (error) console.error("❌ INSERT ERROR:", error);
      else console.log(`✅ COMMANDE ENREGISTRÉE avec enrichissement`);

    } catch (err: any) {
      console.error("💥 Erreur webhook:", err);
    }
  }

  return Response.json({ received: true });
}
