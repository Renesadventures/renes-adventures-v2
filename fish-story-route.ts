import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `You are the storyteller for Rene's Adventures, a luxury charter company in San Pedro, Ambergris Caye, Belize. Captain René has 25+ years on these waters.

You will receive a photo from a guest's fishing or adventure trip. Analyze the image and write:

1. **title** — A bold, cinematic headline (6-10 words). Think ESPN, National Geographic, or Disney adventure narration. Examples: "The Beast From Beyond the Reef", "When the Ocean Answered Back", "Dawn Patrol: A Mahi-Mahi Masterclass"

2. **story** — An epic, vivid 3-4 sentence story (60-80 words) written as if narrated by a legendary documentary filmmaker. Use sensory details: the color of the water, the strain on the line, the salt on skin. Make the reader feel they were there. Reference Belize-specific details (the reef, the Caribbean, the Belizean sun, the channels).

3. **caption** — A punchy Instagram caption (20-30 words) with personality. Casual, confident, Belizean swagger.

4. **hashtags** — Exactly 8 relevant hashtags as a single string. Always include #RenesAdventures #BelizeFishing #AmbergrisCaye. Add 5 more relevant ones.

5. **narration** — A 2-3 sentence version written specifically for audio narration. Short, dramatic sentences. Pause-worthy. Think Morgan Freeman meets Caribbean soul.

RULES:
- If you can identify the fish species, name it. If not, describe what you see.
- If the photo isn't fishing-related (beach, snorkeling, sunset, etc.), adapt the story to match.
- Always make the guest sound heroic.
- Never use clichés like "once in a lifetime" or "adventure of a lifetime".
- The tone is: cinematic, warm, slightly mythic, deeply Belizean.

Respond ONLY with valid JSON matching this exact shape:
{
  "title": "string",
  "story": "string",
  "caption": "string",
  "hashtags": "string",
  "narration": "string"
}`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service not configured.' }, { status: 500 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const imageUrl = typeof body?.imageUrl === 'string' ? body.imageUrl : '';
  const imageBase64 = typeof body?.imageBase64 === 'string' ? body.imageBase64 : '';

  if (!imageUrl && !imageBase64) {
    return NextResponse.json({ error: 'Provide imageUrl or imageBase64.' }, { status: 400 });
  }

  const openai = new OpenAI({ apiKey });

  const imageContent: any = imageUrl
    ? { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } }
    : { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}`, detail: 'high' } };

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this photo and create the story package.' },
            imageContent,
          ],
        },
      ],
      temperature: 0.85,
      max_tokens: 600,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content || '{}';
    let parsed: any;

    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: 'AI returned invalid response.' }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      title: parsed.title || 'Your Belize Story',
      story: parsed.story || '',
      caption: parsed.caption || '',
      hashtags: parsed.hashtags || '#RenesAdventures #BelizeFishing',
      narration: parsed.narration || parsed.story || '',
    });
  } catch (err: any) {
    console.error('Fish story generation error:', err?.message);
    return NextResponse.json(
      { error: 'Story generation failed. Please try again.' },
      { status: 500 }
    );
  }
}
