import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { userId } = await req.json();
    const startupId = context.params.id;

    if (!userId || !startupId) {
      return NextResponse.json({ success: false, error: "Missing userId or startupId" }, { status: 400 });
    }

    const startup = await client.fetch(STARTUP_BY_ID_QUERY, { id: startupId });

    if (!startup) {
      return NextResponse.json({ success: false, error: "Startup not found" }, { status: 404 });
    }

    const joinRequests = startup.joinRequests || [];

    if (!joinRequests.includes(userId)) {
      await writeClient
        .patch(startupId)
        .setIfMissing({ joinRequests: [] })
        .append("joinRequests", [userId])
        .commit();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Join request failed:", err);
    return NextResponse.json({ success: false, error: "Failed to join" }, { status: 500 });
  }
  
}

