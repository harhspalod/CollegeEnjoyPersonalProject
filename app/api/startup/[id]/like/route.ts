// app/api/startup/[id]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';
import { createClient } from '@sanity/client';

const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2023-06-01',
  useCdn: false
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await req.json();
    const startupId = params.id;

    if (!userId || !startupId) {
      return NextResponse.json(
        { success: false, message: 'Missing userId or startupId' },
        { status: 400 }
      );
    }

    // 1. Fetch existing document
    const doc = await readClient.getDocument(startupId);
    const currentLikes = doc?.likes || [];

    // 2. If already liked, return
    if (currentLikes.includes(userId)) {
      return NextResponse.json({
        success: false,
        message: 'Already liked',
        likes: currentLikes.length,
      });
    }

    // 3. Patch new like
    const updatedDoc = await writeClient
      .patch(startupId)
      .setIfMissing({ likes: [] })
      .append('likes', [userId])
      .commit();

    return NextResponse.json({
      success: true,
      likes: updatedDoc.likes.length,
    });
  } catch (err) {
    console.error('LIKE API ERROR', err);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

