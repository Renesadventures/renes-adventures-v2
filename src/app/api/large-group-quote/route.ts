import { NextRequest, NextResponse, after } from 'next/server';
import { createLead } from '@/lib/liadesk';
import { draftAndAttach } from '@/lib/lia-brain/draft';

/**
 * POST /api/large-group-quote
 *
 * The 9-or-more-guests quote form on every tour page.
 *
 * This route did not exist. The form on the tour pages has been posting to it
 * and getting a 404 back, so the largest enquiries on the site — the groups
 * worth the most money — were thrown away in the browser while the guest was
 * shown an error. Nothing reached Lia Desk and nobody was ever told.
 *
 * It does the same job as /api/crm/lead and answers in the same shape the
 * form already expects. Like that route, a valid submission always gets a 200:
 * a guest who filled the form in correctly should never be punished because
 * the back office is having a bad day.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }

  const name = clean(body.fullName) || clean(body.name);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 60);
  const tourTitle = clean(body.tourTitle, 200) || clean(body.tourSlug, 200);
  const tourDate = clean(body.tourDate, 40);
  const specialRequests = clean(body.specialRequests, 2000);

  const guestsRaw = Number(body.guests);
  const guests = Number.isFinite(guestsRaw) ? Math.round(guestsRaw) : undefined;

  if (!name) {
    return NextResponse.json({ ok: false, error: 'Please give us a name.' }, { status: 400 });
  }
  if (!email && !phone) {
    return NextResponse.json(
      { ok: false, error: 'Please leave an email address or a phone number.' },
      { status: 400 },
    );
  }

  // The group size is the whole point of this form, so it goes in the lead
  // title where it cannot be missed on a phone screen.
  const interest = tourTitle
    ? `${tourTitle} — group of ${guests ?? '9+'}`
    : `Large group charter — ${guests ?? '9+'} guests`;

  const result = await createLead({
    name,
    email,
    phone,
    interest,
    message: specialRequests,
    source: 'Website',
    tripDate: tourDate,
    guests,
    eventKind: 'form_lead',
    extra: {
      Form: 'Large group quote (9+ guests)',
      Tour: tourTitle,
      'Requested date': tourDate,
      Guests: guests,
    },
  });

  if (result.leadId) {
    const leadId = result.leadId;
    after(async () => {
      await draftAndAttach(leadId, {
        kind: 'form',
        name,
        email,
        body: specialRequests || `Large group quote request for ${tourTitle || 'a charter'}.`,
        facts: {
          'Interested in': tourTitle,
          'Requested date': tourDate,
          Guests: guests,
          Phone: phone,
          Form: 'Large group quote (9+ guests)',
        },
      });
    });
  }

  return NextResponse.json({ ok: true, leadId: result.leadId ?? null });
}
