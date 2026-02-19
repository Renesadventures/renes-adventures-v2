import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Default to "Adam" voice — warm, narrative male. Update to a cloned Captain René voice ID when available.
const DEFAULT_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Narration service not configured.' }, { status: 500 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const text = typeof body?.text === 'string' ? body.text.trim() : '';
  const voiceId = typeof body?.voiceId === 'string' ? body.voiceId : DEFAULT_VOICE_ID;

  if (!text || text.length < 10) {
    return NextResponse.json({ error: 'Text must be at least 10 characters.' }, { status: 400 });
  }

  if (text.length > 1000) {
    return NextResponse.json({ error: 'Text too long (max 1000 chars).' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.65,
            similarity_boost: 0.80,
            style: 0.45,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('ElevenLabs error:', response.status, errorText);
      return NextResponse.json(
        { error: `Narration failed (${response.status}).` },
        { status: 502 }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    const audioDataUrl = `data:audio/mpeg;base64,${base64Audio}`;

    return NextResponse.json({
      ok: true,
      audioUrl: audioDataUrl,
      voiceId,
      characterCount: text.length,
    });
  } catch (err: any) {
    console.error('ElevenLabs narration error:', err?.message);
    return NextResponse.json(
      { error: 'Narration service unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
