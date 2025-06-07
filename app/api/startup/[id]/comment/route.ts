import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId, username, text } = await req.json();
    const startupId = params.id;

    const newComment = {
      _key: `${userId}-${Date.now()}`,
      userId,
      username, // ✅ add this

      text,
      timestamp: new Date().toISOString(),
    };

    const updatedDoc = await writeClient
      .patch(startupId)
      .setIfMissing({ comments: [] })
      .append("comments", [newComment])
      .commit();

    return NextResponse.json({ success: true, comments: updatedDoc.comments });
  } catch (err) {
    console.error("Comment POST error:", err);
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 500 });
  }
}
