import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  console.log("=== STRIPE CHECKOUT DEBUG START ===");
  console.log("STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY);
  console.log("STRIPE_SECRET_KEY length:", process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 0);
  console.log("NEXT_PUBLIC_SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL);

  try {
    const { priceId, userId } = await request.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is missing!");
      return NextResponse.json({ 
        error: "STRIPE_SECRET_KEY is missing in environment variables" 
      }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-04-01',
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mywornskin.vercel.app'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mywornskin.vercel.app'}/subscribe`,
      metadata: {
        userId: userId || 'unknown',
      },
    });

    console.log("Checkout session created successfully:", session.id);
    return NextResponse.json({ sessionId: session.id });

  } catch (error: any) {
    console.error("Full Stripe error:", error);
    return NextResponse.json({ 
      error: error.message || "Unknown error" 
    }, { status: 500 });
  }
}
