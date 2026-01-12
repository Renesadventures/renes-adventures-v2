import { put } from '@vercel/blob';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function getExtensionFromMimeType(mimeType: string) {
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  return '';
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return request.headers.get('x-real-ip') || '';
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get('photo');
    if (!(file instanceof File)) {
      return Response.json({ error: 'Missing photo file (field name: photo).' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return Response.json({ error: 'Invalid file type. Allowed: jpg, png, webp.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return Response.json({ error: 'File too large. Max size is 10MB.' }, { status: 400 });
    }

    const emailRaw = formData.get('email');
    const email = typeof emailRaw === 'string' ? emailRaw.trim() : '';

    const tourTypeRaw = formData.get('tourType');
    const tourType = typeof tourTypeRaw === 'string' ? tourTypeRaw.trim() : '';

    const storyTextRaw = formData.get('storyText');
    const storyText = typeof storyTextRaw === 'string' ? storyTextRaw.trim() : '';

    const widthRaw = formData.get('width');
    const heightRaw = formData.get('height');

    const width = typeof widthRaw === 'string' && widthRaw ? Number(widthRaw) : null;
    const height = typeof heightRaw === 'string' && heightRaw ? Number(heightRaw) : null;

    const hasValidWidth = width === null || (Number.isFinite(width) && width > 0);
    const hasValidHeight = height === null || (Number.isFinite(height) && height > 0);

    if (!hasValidWidth || !hasValidHeight) {
      return Response.json({ error: 'Invalid image dimensions.' }, { status: 400 });
    }

    const now = new Date();
    const uploadTimestamp = now.toISOString();

    const ext = getExtensionFromMimeType(file.type);
    const id = `${now.getTime()}-${crypto.randomUUID()}`;
    const filename = `story-photos/${id}.${ext}`;

    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: false,
    });

    const metadata = {
      id,
      photoUrl: blob.url,
      uploadTimestamp,
      email: email || null,
      tourType: tourType || null,
      storyText: storyText || null,
      ip: getClientIp(request) || null,
      file: {
        filename,
        contentType: file.type,
        size: file.size,
        width,
        height,
      },
    };

    const metadataPath = `story-photos/metadata/${id}.json`;
    const metadataBlob = await put(metadataPath, JSON.stringify(metadata), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    return Response.json({
      id,
      photoUrl: blob.url,
      metadataUrl: metadataBlob.url,
      uploadTimestamp,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed.';
    return Response.json({ error: message }, { status: 500 });
  }
}
