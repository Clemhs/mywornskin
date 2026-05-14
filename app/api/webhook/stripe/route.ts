export async function POST(req: Request) {
  console.log("🚨 Webhook Stripe appelé !");

  try {
    const body = await req.json();
    console.log("Body reçu :", body);
  } catch (e) {
    console.log("Body raw reçu");
  }

  return Response.json({ received: true, message: "Webhook test OK" });
}

export async function GET() {
  return Response.json({ status: "Webhook Stripe actif" });
}
