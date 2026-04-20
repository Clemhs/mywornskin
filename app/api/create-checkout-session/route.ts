import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("API appelée avec body :", body);

    return NextResponse.json({ 
      success: true,
      message: "API fonctionne !",
      received: body 
    });

  } catch (error: any) {
    console.error("Erreur API :", error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}
