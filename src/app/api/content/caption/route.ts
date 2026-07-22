import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  BRAND_VOICE,
  platformGuidance,
  tourContext,
  type Platform,
} from '@/lib/content/social';

export const runtime = 'nodejs';

const VALID: Platform[] = ['instagram', 'facebook', 'tiktok', 'youtube'];

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'AI not configured.' }, { status: 500 });

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const platform = (typeof body.platform === 'string' ? body.platform : 'instagram') as Platform;
  const tourSlug = typeof body.tourSlug === 'string' ? body.tourSlug : 'custom-charter';
  const angle = typeof body.angle === 'string' ? body.angle : 'The private-boat difference';
  if (!VALID.includes(platform)) return NextResponse.json({ error: 'Bad platform.' }, { status: 400 });

  const openai = new OpenAI({ apiKey });

  const system = `You are the social media writer for Rene's Adventures.
${BRAND_VOICE}

Return STRICT JSON only, shape:
{"caption": string, "hashtags": string[]}
The caption must NOT contain the hashtags (they go in the array).
${platformGuidance(platform)}`;

  const user = `Write ONE ${platform} post.
Angle: ${angle}
${tourContext(tourSlug)}
Booking: link in bio / site renesadventures.tours or WhatsApp +501 627 3556.`;

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 400,
      temperature: 0.9,
    });
    const raw = res.choices[0]?.message?.content ?? '{}';
    let parsed: { caption?: string; hashtags?: string[] } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { caption: raw, hashtags: [] };
    }
    return NextResponse.json({
      caption: parsed.caption ?? '',
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
      platform,
      tourSlug,
      angle,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('caption error:', message);
    return NextResponse.json({ error: 'Caption generation failed.' }, { status: 500 });
  }
}
