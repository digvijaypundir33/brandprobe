import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { uploadImage, generateImageFilename } from '@/lib/storage';

export const runtime = 'nodejs';

// POST /api/showcase/upload-image - Upload icon or screenshot
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const reportId = formData.get('reportId') as string;
    const type = formData.get('type') as 'icon' | 'screenshot';

    if (!file || !reportId || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: file, reportId, or type' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only PNG, JPEG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Generate unique filename and upload
    const filename = generateImageFilename(reportId, type, file.name);
    const publicUrl = await uploadImage(file, filename);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error) {
    console.error('Upload image error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload image',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
