import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

export async function POST(
  req: NextRequest,
  { params }: { params: { targetUserId: string } }
) {
  const { userId } = await req.json();
  const targetUserId = params.targetUserId;

  if (!userId || !targetUserId || userId === targetUserId) {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }

  try {
    const userDoc = await client.fetch(
      `*[_type == "author" && _id == $id][0]`,
      { id: targetUserId }
    );

    const followers = userDoc?.followers || [];

    if (followers.includes(userId)) {
      return NextResponse.json({ success: true, message: "Already following" });
    }

    const result = await writeClient
      .patch(targetUserId)
      .setIfMissing({ followers: [] })
      .append("followers", [userId]) // ✅ adds new follower
      .commit();

    console.log("Sanity patch result:", result); // ✅ debug
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Follow Error:", error);
    return NextResponse.json({ success: false, message: "Follow failed" }, { status: 500 });
  }
}
