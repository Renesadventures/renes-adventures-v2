import { NextRequest, NextResponse, after } from 'next/server';
import { createLead, LEAD_SOURCES, type LeadInput, type LeadSource } from '@/lib/liadesk';
import { draftAndAttach } from '@/lib/lia-brain/draft';

/**
 * POST /api/crm/lead
 *
 * The single door every lead on the site walks through — booking enquiries,
 * brochure downloads, the AI concierge, WhatsApp. One door means one place to
 * fix things and one honest count of where business comes from.
 *
 * It always returns 200 to the browser when the submission itself was valid.
 * A visitor who filled in the form correctly should never see an error because
 * the back office is having a bad day; the failure is reported in the payload
 * and logged for us, not thrown at them.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_SOURCES: LeadSource[] = LEAD_SOURCES;

function clean(v: unknown, max = 500): string | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.trim().slice(0, max);
  return s.length ? s : undefined;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid request' },
      { status: 400 },
    );
  }

  // Honeypot. Bots fill every field; a real person never sees this one.
  if (clean(body.company_website)) {
    return NextResponse.json({ ok: true, leadId: null });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 180);
  const phone = clean(body.phone, 60);

  if (!name) {
    return NextResponse.json(
      { ok: false, error: 'Please tell us your name.' },
      { status: 400 },
    );
  }
  if (!email && !phone) {
    return NextResponse.json(
      { ok: false, error: 'Please leave an email or a phone number.' },
      { status: 400 },
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'That email address does not look right.' },
      { status: 400 },
    );
  }

  const rawSource = clean(body.source, 40) as LeadSource | undefined;
  const source: LeadSource =
    rawSource && VALID_SOURCES.includes(rawSource) ? rawSource : 'Website';

  const guestsRaw = body.guests;
  const guests =
    typeof guestsRaw === 'number'
      ? guestsRaw
      : typeof guestsRaw === 'string' && guestsRaw.trim() !== ''
        ? Number(guestsRaw)
        : undefined;

  const input: LeadInput = {
    name,
    email,
    phone,
    interest: clean(body.interest, 160),
    message: clean(body.message, 4000),
    tripDate: clean(body.tripDate, 40),
    guests: Number.isFinite(guests) ? (guests as number) : undefined,
    source,
    extra: {
      page: clean(body.page, 300),
      referrer: req.headers.get('referer') || undefined,
    },
  };

  const result = await createLead(input);

  if (!result.ok) {
    // Loud in the logs, quiet for the visitor. This is the line to watch if
    // leads ever stop appearing in the CRM.
    console.error('[crm/lead] Lia Desk rejected a lead:', result.error, {
      name: input.name,
      email: input.email,
      source: input.source,
    });
    return NextResponse.json({ ok: true, leadId: null, queued: false });
  }

  // Lia writes the reply and parks it on the lead as a draft. After the
  // response, so the visitor never waits on a model call, and never sent —
  // a person reads every draft before it goes anywhere.
  if (result.leadId) {
    const leadId = result.leadId;
    after(async () => {
      await draftAndAttach(leadId, {
        kind: 'form',
        name: input.name,
        email: input.email,
        body: input.message || `Enquiry about: ${input.interest || 'a charter'}`,
        facts: {
          'Interested in': input.interest,
          'Requested date': input.tripDate,
          Guests: input.guests,
          Phone: input.phone,
          'Came from': input.source,
          Page: (input.extra as Record<string, unknown> | undefined)?.page,
        },
      });
    });
  }

  return NextResponse.json({
    ok: true,
    leadId: result.leadId,
    existing: result.existing ?? false,
  });
}

/** GET is a health probe, used by the dashboard. */
export async function GET() {
  const { liadeskStatus } = await import('@/lib/liadesk');
  const status = await liadeskStatus();
  return NextResponse.json(status, { status: status.ok ? 200 : 503 });
}
