import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: reportId } = await params;

  try {
    // Fetch the generated share image from the API using localhost
    // This works even when accessed via ngrok because it runs on the server
    const apiUrl = process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/report/${reportId}/share-image`
      : `http://localhost:3001/api/report/${reportId}/share-image`;

    const shareImageResponse = await fetch(apiUrl);
    const shareImageData = await shareImageResponse.json();

    if (!shareImageData.success || !shareImageData.imageUrl) {
      return new Response('Image not found', { status: 404 });
    }

    // If it's a base64 image, convert and return
    if (shareImageData.imageUrl.startsWith('data:image/png;base64,')) {
      const base64Data = shareImageData.imageUrl.replace('data:image/png;base64,', '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      return new Response(imageBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // If it's a Supabase URL (could be localhost or production)
    // For localhost URLs (127.0.0.1), fetch directly from local storage
    let imageUrl = shareImageData.imageUrl;

    // Replace localhost URLs with actual localhost for server-side fetch
    if (imageUrl.includes('127.0.0.1:54331')) {
      // Fetch directly from local Supabase storage
      imageUrl = imageUrl.replace('http://127.0.0.1:54331', 'http://localhost:54331');
    }

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Failed to fetch OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
