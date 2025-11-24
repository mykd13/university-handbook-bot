import { NextResponse } from "next/server";

// Facebook Verification (GET)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Verification failed", { status: 403 });
}

// Handle incoming messages (POST)
export async function POST(req) {
  const body = await req.json();

  if (body.object === "page") {
    for (const entry of body.entry) {
      const event = entry.messaging[0];

      const senderId = event.sender?.id;
      const messageText = event.message?.text;

      if (senderId && messageText) {
        console.log("Incoming message:", messageText);

        // Temporary reply
        await sendMessage(senderId, "Message received!");
      }
    }
    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  }

  return new NextResponse("Not a Messenger event", { status: 404 });
}

// Function to send a message back to user
async function sendMessage(senderId, text) {
  const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: senderId },
      message: { text }
    })
  });
}
