/**
 * Minimal, visible FAQ accordion for tour pages.
 * New component — does not touch the locked page.tsx template.
 * Kept deliberately plain (native <details>/<summary>, no JS) so the
 * FAQPage structured data in layout.tsx always matches what's on screen.
 */
type FaqItem = { q: string; a: string };

export default function TourFAQ({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;

  return (
    <section className="mx-auto w-full max-w-screen-2xl px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xs uppercase tracking-[0.35em] text-sky-700">
          Frequently Asked Questions
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {items.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                {item.q}
                <span className="shrink-0 text-slate-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
