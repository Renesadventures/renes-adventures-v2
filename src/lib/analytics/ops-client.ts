/**
 * Browser → /api/ops/event → Lia Desk.
 *
 * Fire-and-forget with sendBeacon so it survives the click that navigates
 * away (WhatsApp, phone, Stripe). The server reads the attribution cookies
 * itself, so nothing personal travels in the body.
 */

export type OpsClientKind =
  | 'visit'
  | 'chat_opened'
  | 'chat_message'
  | 'chat_handoff'
  | 'whatsapp_click'
  | 'phone_click'
  | 'booking_started'
  | 'guide_view';

export function sendOpsEvent(
  kind: OpsClientKind,
  data: { page?: string; item?: string; value?: number } = {},
): void {
  if (typeof window === 'undefined') return;
  try {
    const body = JSON.stringify({
      kind,
      page: data.page || window.location.pathname,
      item: data.item,
      value: data.value,
    });
    const blob = new Blob([body], { type: 'application/json' });
    if (navigator.sendBeacon && navigator.sendBeacon('/api/ops/event', blob)) return;
    void fetch('/api/ops/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* never break the page */
  }
}
