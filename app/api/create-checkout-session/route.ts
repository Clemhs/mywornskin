import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Body reçu :", body);

    return NextResponse.json({ 
      message: "API appelée avec succès",
      receivedPriceId: body.priceId 
    });

  } catch (error: any) {
    console.error("Erreur dans l'API :", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
