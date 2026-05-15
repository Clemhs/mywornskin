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
    console.log(`🔥 WEBHOOK REÇU - Type: ${event.type}`);
  } catch (err: any) {
    console.error("❌ Signature error:", err.message);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("📦 Session ID:", session.id);
    console.log("💰 Montant:", session.amount_total);
    console.log("👤 User ID:", session.metadata?.user_id);

    try {
      const supabase = await createClient();

      // Récupération détaillée des line items
      const lineItemsData = await stripe.checkout.sessions.listLineItems(session.id);
      const lineItems = lineItemsData.data || [];

      console.log(`🛍️ ${lineItems.length} article(s) trouvé(s)`);

      // Extraction du product_id (plusieurs façons de fallback)
      let productId: string | number | null = null;
      if (lineItems.length > 0) {
        const firstItem = lineItems[0];
        productId = firstItem.price?.metadata?.product_id 
          || firstItem.price?.product?.metadata?.product_id 
          || firstItem.metadata?.product_id 
          || null;
      }

      console.log("🆔 Product ID extrait :", productId);

      // Enrichissement complet
      const enrichedItems = lineItems.map((item: any) => ({
        title: item.description || "Produit",
        price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
        quantity: item.quantity || 1,
        // On mettra les vraies infos plus tard si besoin
      }));

      const { error } = await supabase.from('orders').insert({
        user_id: session.metadata?.user_id,
        product_id: productId || 1,           // ← Fallback obligatoire pour éviter l'erreur NOT NULL
        stripe_session_id: session.id,
        amount: session.amount_total || 0,
        status: 'paid',
        customer_email: session.customer_email,
        customer_name: session.customer_details?.name || '',
        items: enrichedItems,
      });

      if (error) {
        console.error("❌ Erreur INSERT :", error);
      } else {
        console.log("✅ COMMANDE ENREGISTRÉE AVEC SUCCÈS !");
      }
    } catch (err: any) {
      console.error("💥 Erreur générale dans le webhook :", err);
    }
  }

  return Response.json({ received: true });
}
