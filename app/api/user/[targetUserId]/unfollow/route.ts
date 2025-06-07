import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";

export async function POST(
  req: NextRequest,
  { params }: { params: { targetUserId: string } }
) {
  const { userId } = await req.json();
  const targetUserId = params.targetUserId;

  if (!userId || !targetUserId || userId === targetUserId) {
    return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
  }

  try {
    await writeClient
      .patch(targetUserId)
      .unset([`followers[_ref=="${userId}"]`]) // Sanity array filtering
      .commit();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unfollow Error:", err);
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
