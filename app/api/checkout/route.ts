import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cartItems } = body;

    if (!cartItems || cartItems.length === 0) {
      return Response.json({ error: "Panier vide" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return Response.json({ error: "Non authentifié" }, { status: 401 });

    const line_items = cartItems.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title,
          images: item.images?.[0] ? [item.images[0]] : [],
          metadata: { 
            product_id: String(item.id)   // ← On force le vrai ID du produit
          },
        },
        unit_amount: Math.round((item.price || 0) * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      metadata: {
        user_id: user.id,
      },
    });

    return Response.json({ url: session.url });

  } catch (error: any) {
    console.error("Checkout error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
