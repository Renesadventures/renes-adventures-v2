import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, tourSlug, tourTitle, timestamp } = body || {};

    const userAgent = request.headers.get('user-agent');
    const trackingData = {
      email,
      tourSlug,
      tourTitle,
      timestamp,

      ipAddress:
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown',
      userAgent,
      referer: request.headers.get('referer'),

      sessionId: request.cookies.get('session_id')?.value,
      utmSource: request.cookies.get('utm_source')?.value,
      utmMedium: request.cookies.get('utm_medium')?.value,
      utmCampaign: request.cookies.get('utm_campaign')?.value,

      deviceType: getUserDeviceType(userAgent),

      timeOnSite: request.cookies.get('time_on_site')?.value,
      pagesVisited: request.cookies.get('pages_visited')?.value,
    };

    console.log('📥 Brochure Download Tracked:', trackingData);

    const response = NextResponse.json({ success: true });

    response.cookies.set('brochure_downloaded', 'true', {
      maxAge: 2592000,
      path: '/',
      httpOnly: false,
    });

    if (tourSlug) {
      response.cookies.set('downloaded_tour', String(tourSlug), {
        maxAge: 2592000,
        path: '/',
        httpOnly: false,
      });
    }

    return response;
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}

function getUserDeviceType(userAgent: string | null): string {
  if (!userAgent) return 'unknown';
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  return 'desktop';
}
