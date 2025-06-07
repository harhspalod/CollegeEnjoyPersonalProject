import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { userId } = await req.json();
    const startupId = context.params.id;

    console.log("🚀 Approving join request:", { startupId, userId });

    if (!userId || !startupId) {
      return NextResponse.json({ success: false, message: "Missing userId or startupId" }, { status: 400 });
    }

    const startup = await client.fetch(STARTUP_BY_ID_QUERY, { id: startupId });

    if (!startup) {
      console.error("❌ Startup not found");
      return NextResponse.json({ success: false, message: "Startup not found" }, { status: 404 });
    }

    const patch = writeClient.patch(startupId).setIfMissing({
      joinRequests: [],
      teamMembers: [],
    });

    // Remove userId from joinRequests if it exists
    if (startup.joinRequests?.includes(userId)) {
      patch.unset([`joinRequests[_ == "${userId}"]`]);
    }

    // Add userId to teamMembers if not already there
    if (!startup.teamMembers?.includes(userId)) {
      patch.append("teamMembers", [userId]);
    }

    const result = await patch.commit();

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error("❌ Approval error:", err.message || err);
    return NextResponse.json({ success: false, message: "Failed to approve" }, { status: 500 });
  }
}
