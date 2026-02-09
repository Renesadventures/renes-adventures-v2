import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const RequestSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(8).max(40),
  tourSlug: z.string().min(1).max(120),
  tourTitle: z.string().min(1).max(200),
  tourDate: z.string().min(1).max(40).optional(),
  guests: z.number().int().min(9).max(200),
  specialRequests: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.LARGE_GROUP_QUOTE_TO || 'bookings@renesadventures.tours';

  if (!apiKey) {
    return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 });
  }

  if (!from) {
    return NextResponse.json({ error: 'RESEND_FROM is not configured.' }, { status: 500 });
  }

  const data = parsed.data;

  const subject = `9+ Guest Quote Request — ${data.tourTitle} (${data.guests} guests)`;

  const text = [
    'Large Group Quote Request',
    '-------------------------',
    `Tour: ${data.tourTitle} (${data.tourSlug})`,
    `Date: ${data.tourDate || 'Not provided'}`,
    `Guests: ${data.guests}`,
    '',
    `Name: ${data.fullName}`,
    `Email: ${data.email}`,
    `Phone/WhatsApp: ${data.phone}`,
    '',
    'Special Requests:',
    data.specialRequests || '(none)',
    '',
    `Submitted: ${new Date().toISOString()}`,
  ].join('\n');

  try {
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject,
      text,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to send email.' },
      { status: 502 }
    );
  }
}
