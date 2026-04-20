import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json();

    console.log("Price ID reçu :", priceId);
    console.log("STRIPE_SECRET_KEY existe ?", !!process.env.STRIPE_SECRET_KEY);
    console.log("Longueur de la clé :", process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 0);

    return NextResponse.json({ 
      message: "API appelée avec succès",
      priceId 
    });

  } catch (error: any) {
    console.error("Erreur API :", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
