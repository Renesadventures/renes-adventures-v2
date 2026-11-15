/**
 * A loud stripe across the top of any deployment that is not production.
 *
 * The preview deployment is a complete copy of the real site: same design,
 * same prices, same booking flow, pointed at Stripe's test mode. That is the
 * point of it — and it is also how somebody ends up testing on the real site
 * by accident, or screenshotting a test total and sending it to a guest.
 *
 * Vercel sets VERCEL_ENV to 'production', 'preview' or 'development'. On
 * production this renders nothing at all.
 */
export default function TestModeBanner() {
  const env = process.env.VERCEL_ENV;
  if (!env || env === 'production') return null;

  return (
    <div
      role="status"
      style={{
        position: 'relative',
        zIndex: 9999,
        background: 'repeating-linear-gradient(45deg,#111,#111 12px,#f5c518 12px,#f5c518 24px)',
        padding: '2px',
      }}
    >
      <div
        style={{
          background: '#111',
          color: '#f5c518',
          font: '700 13px/1.4 system-ui, sans-serif',
          letterSpacing: '0.04em',
          textAlign: 'center',
          padding: '8px 16px',
        }}
      >
        TEST COPY — NOT THE REAL SITE. No card is charged. Nothing booked here is a real booking.
      </div>
    </div>
  );
}
