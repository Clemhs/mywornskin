import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-01',
});

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'https://mywornskin.vercel.app/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://mywornskin.vercel.app/subscribe',
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("Stripe checkout error:", error.message);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
