import { NextRequest, NextResponse, after } from 'next/server';
import { createLead } from '@/lib/liadesk';
import { draftAndAttach } from '@/lib/lia-brain/draft';

/**
 * POST /api/belize-guide
 *
 * The Belize Survival Kit sign-up.
 *
 * This route used to write the guest's name, email, phone, visit date and
 * interests to a console log and return success. Everyone who asked for the
 * free guide was collected and thrown away. Now it creates a lead like every
 * other door on the site.
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
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const email = clean(body.email, 200);
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const name = clean(body.name) || email.split('@')[0];
  const phone = clean(body.phone, 60);
  const tier = clean(body.type, 80);
  const visitDate = clean(body.visitDate, 40) || clean(body.date, 40);
  const interests = Array.isArray(body.interests)
    ? body.interests.filter((i) => typeof i === 'string').slice(0, 20).join(', ')
    : clean(body.interests, 500);

  const result = await createLead({
    name,
    email,
    phone,
    interest: `Belize Survival Kit${tier ? ` (${tier})` : ''}`,
    message: interests ? `Interested in: ${interests}` : undefined,
    source: 'Website',
    tripDate: visitDate,
    eventKind: 'form_lead',
    extra: {
      Form: 'Belize Survival Kit',
      Tier: tier,
      'Visiting around': visitDate,
      Interests: interests,
    },
  });

  if (result.leadId) {
    const leadId = result.leadId;
    after(async () => {
      await draftAndAttach(leadId, {
        kind: 'form',
        name,
        email,
        body: interests
          ? `Asked for the Belize Survival Kit. Interested in: ${interests}`
          : 'Asked for the Belize Survival Kit.',
        facts: {
          Form: 'Belize Survival Kit',
          Tier: tier,
          'Visiting around': visitDate,
          Phone: phone,
        },
      });
    });
  }

  // The guest gets their guide whatever the back office did.
  return NextResponse.json({ success: true });
}
