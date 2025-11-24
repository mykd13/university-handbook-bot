import { NextResponse } from "next/server";

export async function GET(req) {
  return new NextResponse("Webhook is live", { status: 200 });
}

export async function POST(req) {
  const body = await req.json();
  console.log("POST received:", body);
  return new NextResponse("POST received", { status: 200 });
}
