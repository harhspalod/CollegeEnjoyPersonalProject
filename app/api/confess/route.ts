import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";

export async function POST(req: NextRequest) {
  try {
    const { to, from, message } = await req.json();

    const confession = await writeClient.create({
      _type: "confession",
      to,
      from,
      message,
      timestamp: new Date().toISOString(),
      approved: false, // or true if auto-approved
    });

    return NextResponse.json({ success: true, _id: confession._id });
  } catch (err) {
    console.error("Confession error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
