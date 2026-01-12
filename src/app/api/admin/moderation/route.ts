import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

export const runtime = 'nodejs';

type ModerationStatus = 'Pending' | 'Approved' | 'Rejected';

type ModerationPost = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ModerationStatus;
  source: 'instant_legend' | 'story_photo' | 'manual';
  mediaUrl: string;
  caption?: string | null;
  authorName?: string | null;
  authorHandle?: string | null;
  metadataUrl?: string | null;
  rejectionReason?: string | null;
};

type ModerationDb = {
  posts: ModerationPost[];
};

const DB_PATH = path.join(process.env.TMPDIR || process.env.TEMP || '/tmp', 'renes-moderation-db.json');

async function readDb(): Promise<ModerationDb> {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return { posts: [] };
    const posts = Array.isArray((parsed as ModerationDb).posts) ? (parsed as ModerationDb).posts : [];
    return { posts };
  } catch {
    return { posts: [] };
  }
}

async function writeDb(db: ModerationDb) {
  const dir = path.dirname(DB_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

function isAdmin(request: NextRequest) {
  const token = request.headers.get('x-admin-token') || request.nextUrl.searchParams.get('token') || '';
  const expected = process.env.ADMIN_TOKEN || '';
  return Boolean(expected && token && token === expected);
}

const CreateSchema = z.object({
  action: z.literal('create'),
  post: z.object({
    source: z.enum(['instant_legend', 'story_photo', 'manual']).default('manual'),
    mediaUrl: z.string().url(),
    caption: z.string().max(2000).optional().nullable(),
    authorName: z.string().max(120).optional().nullable(),
    authorHandle: z.string().max(120).optional().nullable(),
    metadataUrl: z.string().url().optional().nullable(),
  }),
});

const ModerateSchema = z.object({
  action: z.enum(['approve', 'reject']),
  id: z.string().min(1),
  rejectionReason: z.string().max(300).optional().nullable(),
});

export async function GET(request: NextRequest) {
  const db = await readDb();
  const status = (request.nextUrl.searchParams.get('status') || 'Approved') as ModerationStatus | 'All';

  // Public reads are limited to Approved only.
  if (status !== 'Approved' && !isAdmin(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const visible = status === 'All' ? db.posts : db.posts.filter((p) => p.status === status);
  const sort = visible.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return Response.json({ posts: sort });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as unknown;

  const create = CreateSchema.safeParse(body);
  const moderate = ModerateSchema.safeParse(body);

  if (!create.success && !moderate.success) {
    return Response.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const db = await readDb();

  if (create.success) {
    // Create is intentionally allowed without admin auth, but always lands in Pending.
    const now = new Date().toISOString();
    const id = `${Date.now()}-${crypto.randomUUID()}`;

    const post: ModerationPost = {
      id,
      createdAt: now,
      updatedAt: now,
      status: 'Pending',
      source: create.data.post.source,
      mediaUrl: create.data.post.mediaUrl,
      caption: create.data.post.caption ?? null,
      authorName: create.data.post.authorName ?? null,
      authorHandle: create.data.post.authorHandle ?? null,
      metadataUrl: create.data.post.metadataUrl ?? null,
      rejectionReason: null,
    };

    db.posts.unshift(post);
    await writeDb(db);
    return Response.json({ ok: true, post });
  }

  if (!moderate.success) {
    return Response.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (!isAdmin(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { action, id, rejectionReason } = moderate.data;
  const idx = db.posts.findIndex((p) => p.id === id);
  if (idx < 0) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const existing = db.posts[idx] as ModerationPost;
  const now = new Date().toISOString();
  const next: ModerationPost = {
    ...existing,
    updatedAt: now,
    status: action === 'approve' ? 'Approved' : 'Rejected',
    rejectionReason: action === 'reject' ? (rejectionReason || 'Not specified') : null,
  };

  db.posts[idx] = next;
  await writeDb(db);

  return Response.json({ ok: true, post: next });
}
