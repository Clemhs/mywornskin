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
    console.error('❌ Signature failed:', err.message);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`🔥 Webhook reçu : ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`💰 Session ID: ${session.id}`);
    console.log(`👤 User ID from metadata:`, session.metadata?.user_id);

    try {
      const supabase = await createClient();

      // Extraction des product_ids
      const productIds = session.line_items?.data
        .map((item: any) => item.price?.metadata?.product_id)
        .filter(Boolean) || [];

      console.log(`📦 Product IDs trouvés :`, productIds);

      let enrichedItems: any[] = [];

      if (productIds.length > 0) {
        const { data: products, error } = await supabase
          .from('products')
          .select(`
            id, title, description, images, price,
            creator:profiles!creator_id (username, full_name)
          `)
          .in('id', productIds);

        if (error) console.error("❌ Erreur fetch products:", error);

        console.log(`✅ Produits trouvés en base :`, products?.length);

        enrichedItems = session.line_items?.data.map((item: any) => {
          const product = products?.find(p => p.id === item.price?.metadata?.product_id);
          const creator = product?.creator?.[0];

          return {
            title: product?.title || item.description || "Produit inconnu",
            description: product?.description || "",
            images: product?.images || [],
            price: item.price?.unit_amount ? item.price.unit_amount / 100 : (item.price || 0),
            quantity: item.quantity || 1,
            creator_name: creator?.full_name || "Créatrice",
            creatorSlug: creator?.username,
          };
        }) || [];
      }

      console.log(`📝 Items enrichis :`, enrichedItems);

      const { error: insertError } = await supabase.from('orders').insert({
        user_id: session.metadata?.user_id,
        stripe_session_id: session.id,
        amount: session.amount_total,
        status: 'paid',
        customer_email: session.customer_email,
        customer_name: session.customer_details?.name || '',
        items: enrichedItems,
      });

      if (insertError) console.error("❌ Erreur insert:", insertError);
      else console.log(`🎉 Commande sauvegardée avec succès !`);

    } catch (err) {
      console.error("💥 Erreur générale :", err);
    }
  }

  return Response.json({ received: true });
}
