/**
 * Lia's knowledge — the moat, built from content that already existed.
 *
 * Rene's Adventures has 15 long-form articles, 9 "Belize · Untold" chapters, a
 * twelve-month fishing calendar and the tour data. Competitors' chatbots answer
 * questions about their boat. Fed this, Lia answers questions about the trip:
 * how to get to Ambergris Caye, whether November fishes well, what lobster
 * season means, whether a six-year-old will cope.
 *
 * There is no vector database and there does not need to be one. The corpus is
 * a few hundred passages and it ships inside the bundle, so retrieval is a
 * keyword score over an in-memory index: no extra service, no embedding cost,
 * no cold start, and the same answer every time for the same question — which
 * matters when the thing being retrieved is what a business tells its guests.
 *
 * THE ONE HARD RULE IN THIS FILE: every passage goes through stripMoney before
 * it can reach the model. One of the articles is literally a price guide. The
 * owner's instruction is that Lia never quotes a price, and the reliable way to
 * enforce that is to never show her one — a prompt can be talked around, an
 * absent number cannot be recalled. If you add a source, it goes through
 * stripMoney too, or the guarantee is gone.
 */

import { tours, tourActivitiesBySlug, tourGear } from '@/data/tours';
import { blogPosts } from '@/data/blog-posts';
import { belizeChapters } from '@/data/belize-chapters';
import { AMBERGRIS_CAYE_FISHING_CALENDAR } from '@/lib/lia-knowledge/fishing-calendar';

export type PassageKind = 'tour' | 'activity' | 'article' | 'belize' | 'season' | 'product';

export interface Passage {
  id: string;
  kind: PassageKind;
  /** Shown to the model so it can say where the answer came from. */
  title: string;
  text: string;
  /** Lowercased tokens, precomputed once. */
  titleTokens: Set<string>;
  bodyTokens: Set<string>;
}

/* ------------------------------------------------------------------ money --- */

const MONEY_PATTERNS: Array<[RegExp, string]> = [
  // $675, $1,200.00, $ 75
  [/\$\s?\d[\d,]*(?:\.\d{1,2})?/g, 'the price listed on the website'],
  // 675 USD / BZD 500 / 500 Belize dollars
  [/\b(?:USD|BZD)\s?\d[\d,]*(?:\.\d{1,2})?/gi, 'the price listed on the website'],
  [/\b\d[\d,]*(?:\.\d{1,2})?\s?(?:USD|BZD)\b/gi, 'the price listed on the website'],
  [/\b\d[\d,]*\s?(?:US |Belize |Belizean )?dollars?\b/gi, 'the price listed on the website'],
];

/**
 * Remove every currency amount. Lia cannot quote what she was never shown.
 * Exported because the tests assert on it — if this ever stops working, the
 * owner's first rule stops being enforced and only the prompt is left.
 */
export function stripMoney(text: string): string {
  let out = text;
  for (const [re, replacement] of MONEY_PATTERNS) out = out.replace(re, replacement);
  return out;
}

/* ------------------------------------------------------------- tokenising --- */

const STOPWORDS = new Set([
  'the','and','for','are','but','not','you','your','with','that','this','have','has','had','was','were','will','would','can','could','should','what','when','where','which','who','how','why','there','their','they','them','from','about','into','out','does','did','doing','our','ours','its','it','is','be','been','being','a','an','of','to','in','on','at','by','or','if','as','we','us','my','me','i','do','so','up','any','all','some','just','like','get','got','go','going','want','need','know','tell','say','said','also','very','more','most','much','many','one','two','make','made','take','see','look','come','came','than','then','too','only','over','after','before','because','while','during','each','both','same','other','new','good','best','really','think','thing','things','lot','okay','ok','yes','no','hi','hello','hey','thanks','thank','please',
]);

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z][a-z'-]{2,}/g) ?? [])
    .map((w) => w.replace(/'s$/, ''))
    // Crude singularisation so "sharks" matches "shark", "tours" matches "tour".
    .map((w) => (w.length > 4 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w))
    .filter((w) => !STOPWORDS.has(w));
}

function passage(id: string, kind: PassageKind, title: string, rawText: string): Passage {
  const text = stripMoney(rawText).replace(/\s+/g, ' ').trim();
  return {
    id,
    kind,
    title: stripMoney(title),
    text,
    titleTokens: new Set(tokenize(title)),
    bodyTokens: new Set(tokenize(text)),
  };
}

/* ----------------------------------------------------------------- corpus --- */

function buildCorpus(): Passage[] {
  const out: Passage[] = [];

  // ---- Tours. Price fields are never read, so they cannot leak.
  for (const t of tours) {
    const lines = [
      t.description,
      `Runs as: ${[t.hasHalfDay ? t.duration : null, t.hasFullDay ? t.fullDayDuration ?? 'Full day' : null]
        .filter(Boolean)
        .join(' or ')}.`,
      `Private charter for up to ${t.maxGuests} guests.`,
      t.features?.length ? `What it includes: ${t.features.join('; ')}.` : '',
      `Full details and pricing: the ${t.title} page on the website (/tours/${t.slug}).`,
    ].filter(Boolean);
    out.push(passage(`tour:${t.slug}`, 'tour', t.title, lines.join(' ')));

    const acts = tourActivitiesBySlug[t.slug] ?? [];
    for (const a of acts) {
      out.push(
        passage(
          `activity:${t.slug}:${a.id}`,
          'activity',
          `${a.title} (on the ${t.title})`,
          [a.description, a.note, a.keywords?.join(', ')].filter(Boolean).join(' '),
        ),
      );
    }
  }

  // ---- What is aboard. Asked constantly; the answer is reassuring and free.
  out.push(
    passage(
      'product:included',
      'product',
      'What is included on every charter',
      'Every trip is a private charter — you never share the boat with strangers. ' +
        'Two certified guides. Permits and marine-park paperwork handled by the crew, ' +
        'though the Hol Chan Marine Reserve ranger fee is collected directly at the ' +
        'reserve entry. Aboard: snorkel gear, bottled water, sodas, snacks and rum punch. ' +
        'The full day includes the private Beach BBQ — fresh catch, ceviche, rice, ' +
        'potatoes and vegetables, with lobster and conch when the season is open. ' +
        'Catch is cleaned, filleted and yours to keep. Up to eight guests.',
    ),
  );
  if (tourGear?.length) {
    out.push(
      passage(
        'product:gear',
        'product',
        'Gear and what to bring',
        tourGear
          .map((g: any) => [g.name ?? g.title, g.description, g.note].filter(Boolean).join(' — '))
          .join('. '),
      ),
    );
  }

  // ---- Blue Hole gets its own passage so the handling rule travels with it.
  out.push(
    passage(
      'product:blue-hole-policy',
      'product',
      'The Great Blue Hole — how it is handled',
      'The Great Blue Hole is a near-perfect circle roughly three hundred feet deep, ' +
        'one of the great underwater wonders, about two hours out from San Pedro. ' +
        'It is a full-day open-water trip and it is handled by enquiry only: it is ' +
        'never quoted or booked in chat. Any Blue Hole conversation goes to the team, ' +
        'who build the day around the group and the season.',
    ),
  );

  // ---- The 15 articles, one passage per section, so retrieval lands on the
  //      paragraph that answers the question rather than a whole essay.
  for (const p of blogPosts) {
    out.push(
      passage(`article:${p.slug}:intro`, 'article', `${p.title} — in short`, `${p.excerpt} ${p.description}`),
    );
    p.sections.forEach((s, i) => {
      const body = [s.heading, ...(s.paragraphs ?? []), ...(s.bullets ?? [])].filter(Boolean).join(' ');
      if (body.trim().length < 40) return;
      out.push(
        passage(
          `article:${p.slug}:${i}`,
          'article',
          // Every passage needs a distinct heading, or the model is handed the
          // same title four times and cannot tell the paragraphs apart.
          s.heading ? `${p.title} — ${s.heading}` : `${p.title} — part ${i + 1}`,
          body,
        ),
      );
    });
  }

  // ---- Belize · Untold. The storytelling voice; good for "what is it like".
  for (const c of belizeChapters) {
    out.push(
      passage(
        `belize:${c.slug}`,
        'belize',
        `Belize · Untold: ${c.title}`,
        [c.tagline, c.headline, ...c.body, c.rene ? `Rene says: ${c.rene}` : ''].filter(Boolean).join(' '),
      ),
    );
  }

  // ---- Twelve-month calendar. This is what makes "is November good for
  //      fishing?" answerable. Seasonal pattern only — never a forecast.
  const cal = AMBERGRIS_CAYE_FISHING_CALENDAR;
  out.push(
    passage(
      'season:general',
      'season',
      'Fishing around Ambergris Caye — the year in general',
      [cal.notes.general, cal.notes.winds.trade_winds, cal.notes.winds.northers, cal.notes.holidays].join(' '),
    ),
  );
  for (const m of cal.months) {
    out.push(
      passage(
        `season:${m.month.toLowerCase()}:species`,
        'season',
        `${m.month} in Belize — what is running`,
        [
          `Flats and inshore: ${m.primary_species.flats_inshore.join(' ')}`,
          `Reef: ${m.primary_species.reef.join(' ')}`,
          `Offshore: ${m.primary_species.offshore_pelagic.join(' ')}`,
        ].join(' '),
      ),
    );
    out.push(
      passage(
        `season:${m.month.toLowerCase()}:pattern`,
        'season',
        `${m.month} in Belize — seasonal pattern and busy dates`,
        [
          `Typical winds for the month: ${m.wind_conditions_and_tour_locations.dominant_winds}`,
          m.wind_conditions_and_tour_locations.effects_on_fishing.join(' '),
          `Holidays and events: ${m.holidays_and_availability.major_holidays_events.join(' ')}`,
          m.holidays_and_availability.impact_on_boat_tours.join(' '),
        ].join(' '),
      ),
    );
  }

  return out;
}

let CORPUS: Passage[] | null = null;
export function corpus(): Passage[] {
  if (!CORPUS) CORPUS = buildCorpus();
  return CORPUS;
}

/* -------------------------------------------------------------- retrieval --- */

const TITLE_WEIGHT = 3;
const BODY_WEIGHT = 1;

export interface Retrieved {
  passage: Passage;
  score: number;
}

export function retrieve(query: string, limit = 6): Retrieved[] {
  const qTokens = Array.from(new Set(tokenize(query)));
  if (!qTokens.length) return [];

  const scored: Retrieved[] = [];
  for (const p of corpus()) {
    let score = 0;
    for (const t of qTokens) {
      if (p.titleTokens.has(t)) score += TITLE_WEIGHT;
      else if (p.bodyTokens.has(t)) score += BODY_WEIGHT;
    }
    if (score > 0) {
      // Dampen long passages so a 2,000-word section cannot outrank the
      // paragraph that actually answers the question.
      scored.push({ passage: p, score: score / Math.sqrt(Math.max(p.bodyTokens.size, 12)) });
    }
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

const MONTHS = [
  'january','february','march','april','may','june','july','august','september','october','november','december',
];

/**
 * The block of knowledge handed to the model for one turn.
 *
 * Built from the whole conversation, not just the last message, because "what
 * about with kids?" three messages in only makes sense alongside what came
 * before. Always carries the current month and what is aboard, because both
 * come up in nearly every chat.
 */
export function knowledgeBlock(
  query: string,
  history: string[] = [],
  opts: { limit?: number; budget?: number; now?: Date } = {},
): string {
  const { limit = 6, budget = 6500, now = new Date() } = opts;

  // Weight the latest message heaviest; the two before it give context.
  const weighted = [query, query, ...history.slice(-2)].join(' ');
  const hits = retrieve(weighted, limit);

  const monthName = MONTHS[now.getMonth()];
  const alwaysOn = ['product:included', `season:${monthName}:species`];
  // A month they name themselves beats the month it happens to be.
  for (const m of MONTHS) {
    if (new RegExp(`\\b${m}\\b`, 'i').test(`${query} ${history.slice(-2).join(' ')}`)) {
      alwaysOn.push(`season:${m}:species`, `season:${m}:pattern`);
    }
  }

  const byId = new Map(corpus().map((p) => [p.id, p]));
  const chosen: Passage[] = [];
  const seen = new Set<string>();
  for (const id of alwaysOn) {
    const p = byId.get(id);
    if (p && !seen.has(p.id)) {
      seen.add(p.id);
      chosen.push(p);
    }
  }
  for (const h of hits) {
    if (!seen.has(h.passage.id)) {
      seen.add(h.passage.id);
      chosen.push(h.passage);
    }
  }

  const parts: string[] = [];
  let used = 0;
  for (const p of chosen) {
    const block = `### ${p.title}\n${p.text}`;
    if (used + block.length > budget) continue;
    parts.push(block);
    used += block.length;
  }

  if (!parts.length) return '';

  return [
    'WHAT YOU KNOW (from Rene\'s Adventures\' own guides and tour data).',
    'Use it to answer properly. Two things it is not:',
    '- It contains no prices, on purpose. You cannot quote one. Point them to the website.',
    '- Anything about winds or seasons is the general pattern for that time of year,',
    '  not a forecast and never a judgement on whether a trip can run. That is the',
    '  captain\'s call on the day.',
    '',
    parts.join('\n\n'),
  ].join('\n');
}
