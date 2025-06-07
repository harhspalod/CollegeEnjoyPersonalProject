// /app/api/group/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";

export async function POST(req: NextRequest) {
  const { title, description, ownerId } = await req.json();

  if (!title || !ownerId) {
    return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
  }

  try {
    const result = await writeClient.create({
      _type: "group",
      title,
      description,
      owner: { _type: "reference", _ref: ownerId },
      pendingRequests: [],
      members: [],
    });

    return NextResponse.json({ success: true, groupId: result._id });
  } catch (err) {
    console.error("Group Create Error:", err);
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
