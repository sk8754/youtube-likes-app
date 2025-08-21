import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: Request) {
  try {
    const { amount, message } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "jpy",
      metadata: { message: message || "no message provided" },
      setup_future_usage: "off_session",
    });

    const res = NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

    // CORSヘッダーを追加
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
    res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");

    return res;
  } catch (error) {
    console.error("Stripe API Error:", JSON.stringify(error, null, 2));
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// OPTIONS preflight request handler (for CORS)
export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  return res;
}
