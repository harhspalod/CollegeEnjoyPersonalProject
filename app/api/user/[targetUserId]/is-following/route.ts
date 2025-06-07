import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { targetUserId: string } }
) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const targetUserId = params.targetUserId;

  if (!userId || !targetUserId) {
    return NextResponse.json({ success: false, following: false, followerCount: 0 });
  }

  const userDoc = await client.fetch(
    `*[_type == "author" && _id == $id][0]`,
    { id: targetUserId }
  );

  const followers = userDoc?.followers || [];
  const following = followers.includes(userId);
  const followerCount = followers.length;

  return NextResponse.json({
    success: true,
    following,
    followerCount,
  });
}
