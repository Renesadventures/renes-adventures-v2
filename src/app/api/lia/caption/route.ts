import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

const CAPTION_SYSTEM_PROMPT = `You write short captions for Belize
excursion photos from Rene's Adventures.

RULES — follow all of them, no exceptions:
- ONE sentence maximum. Two sentences only if truly necessary.
- Under 14 words if possible.
- Tone: warm, natural, feels like a keepsake memory someone
  would print on a poster or hang on their wall.
- Light humor ONLY if the photo clearly calls for it
  (fishing wins, big smiles, funny moments). Never forced.
- Family-friendly. Always.
- NO marketing language. NO hashtags. NO emojis.
- NO long storytelling. Just the emotion of the moment.
- Focus on: family memory, first catch, adventure, pride, fun.
- Sound like something someone would proudly display at home.

GOOD examples:
  "First catch. Full heart."
  "The one that didn't get away."
  "Salt air, no worries, whole family."
  "Some days Belize just shows off."
  "They said the fish were small. They were wrong."

BAD examples (do NOT write like this):
  "Experience the magic of Belize with Rene's Adventures! 🌊"
  "A beautiful day on the water creating unforgettable memories
   with your loved ones in the crystal-clear Caribbean."`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service not configured.' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const imageDescription = (() => {
    if (!body || typeof body !== 'object') return '';
    const b = body as Record<string, unknown>;
    const value = b.imageDescription;
    return typeof value === 'string' ? value : '';
  })();

  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: CAPTION_SYSTEM_PROMPT },
        { role: 'user', content: `Write a caption for this photo: ${imageDescription}` },
      ],
      max_tokens: 60,
      temperature: 0.8,
    });

    const caption = response.choices[0]?.message?.content ?? 'One more memory made.';
    return NextResponse.json({ caption });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Caption generation error:', message);
    return NextResponse.json({ error: 'Caption generation failed. Please try again.' }, { status: 500 });
  }
}
