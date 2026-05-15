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
    console.log(`🔥 WEBHOOK REÇU - Event: ${event.type}`);
  } catch (err: any) {
    console.error("❌ Signature error:", err.message);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("📦 Session ID:", session.id);
    console.log("💰 Amount:", session.amount_total);
    console.log("👤 User ID (metadata):", session.metadata?.user_id);
    console.log("📧 Customer email:", session.customer_email);

    try {
      const supabase = await createClient();

      // Récupération des line_items
      const lineItemsData = await stripe.checkout.sessions.listLineItems(session.id);
      const lineItems = lineItemsData.data || [];
      console.log(`🛍️ ${lineItems.length} line item(s) trouvés`);

      const productIds = lineItems
        .map((item: any) => item.price?.metadata?.product_id)
        .filter(Boolean);

      console.log("🆔 Product IDs extraits :", productIds);

      let enrichedItems: any[] = [];

      if (productIds.length > 0) {
        const { data: products, error: fetchError } = await supabase
          .from('products')
          .select(`
            id, title, description, images,
            creator:profiles!creator_id (full_name, username)
          `)
          .in('id', productIds);

        if (fetchError) console.error("Erreur fetch products:", fetchError);

        enrichedItems = lineItems.map((item: any) => {
          const product = products?.find(p => String(p.id) === String(item.price?.metadata?.product_id));
          const creator = product?.creator?.[0];

          return {
            title: product?.title || item.description || "Produit inconnu",
            description: product?.description || "",
            images: product?.images || [],
            price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
            quantity: item.quantity || 1,
            creator_name: creator?.full_name || "Créatrice",
            creatorSlug: creator?.username || "",
          };
        });
      }

      // Fallback ultra-sûr
      if (enrichedItems.length === 0) {
        enrichedItems = [{
          title: "Produit (fallback)",
          description: "Description non récupérée",
          images: [],
          price: session.amount_total ? session.amount_total / 100 : 0,
          quantity: 1,
          creator_name: "Créatrice",
          creatorSlug: "",
        }];
      }

      const { error: insertError } = await supabase.from('orders').insert({
        user_id: session.metadata?.user_id,
        product_id: productIds[0] || null,
        stripe_session_id: session.id,
        amount: session.amount_total,
        status: 'paid',
        customer_email: session.customer_email,
        customer_name: session.customer_details?.name || '',
        items: enrichedItems,
      });

      if (insertError) {
        console.error("❌ Erreur INSERT :", insertError);
      } else {
        console.log(`✅ COMMANDE ENREGISTRÉE avec succès ! (${enrichedItems.length} article(s))`);
      }
    } catch (err) {
      console.error("💥 Erreur générale webhook :", err);
    }
  }

  return Response.json({ received: true });
}
