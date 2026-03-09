const fs=require("fs"),path=require("path");
const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'ai', 'concierge', 'route.ts');
let src = fs.readFileSync(filePath, 'utf8');

// ── 1. Fix mojibake throughout the file ──────────────────────────────────────
const fixes = [
  [/â€"/g, '—'],
  [/â€™/g, "'"],
  [/â€œ/g, '"'],
  [/â€/g, '"'],
  [/â†'/g, '→'],
  [/ðŸŒ´/g, '🌴'],
  [/ðŸŒŠ/g, '🌊'],
  [/ðŸŽ£/g, '🎣'],
  [/âš¡/g, '⚡'],
  [/ðŸ"¥/g, '🔥'],
  [/Â·/g, '·'],
  [/Â©/g, '©'],
  [/Â/g, ''],
];
fixes.forEach(([pattern, replacement]) => {
  src = src.replace(pattern, replacement);
});
console.log('✓ Mojibake fixed');

// ── 2. Inject Lia opening question rule right after SYSTEM_PROMPT = ` ────────
const OPENING_RULE = `OPENING QUESTION (CRITICAL — ALWAYS ASK FIRST ON NEW CONVERSATIONS):
- NEVER assume the guest is currently in Belize.
- When starting a new conversation, your very FIRST message must ask:
  "Hey! 👋 Are you currently in Belize, or are you thinking about visiting?"
- Based on their answer, branch your tone:
  - IN BELIZE NOW → urgency mode: "Let's get you on the water today or tomorrow"
  - PLANNING A TRIP → discovery mode: "When are you thinking of coming? Let's build the perfect itinerary"
- Do not pitch any tour until you know which mode you're in.

`;

// Find the start of SYSTEM_PROMPT content (after the backtick)
const promptStart = src.indexOf('const SYSTEM_PROMPT = `') + 'const SYSTEM_PROMPT = `'.length;
if (promptStart > 'const SYSTEM_PROMPT = `'.length) {
  src = src.slice(0, promptStart) + OPENING_RULE + src.slice(promptStart);
  console.log('✓ Opening question rule injected');
} else {
  console.log('✗ Could not find SYSTEM_PROMPT');
}

// ── 3. Fix BBQ upsell line — half day has no BBQ ─────────────────────────────
src = src.replace(
  '"Most guests add the Beach BBQ because it turns the day into a full experience — want me to include it?"',
  '"Thinking about a full day? It comes with Beach BBQ included — fresh catch, ceviche, open fire on the sand. Want me to price out the full day for your group?"'
);
console.log('✓ BBQ upsell line updated');

// ── 4. Fix lobster seasonality language ──────────────────────────────────────
// Inject into the system prompt lobster note if it exists, or add it
if (src.includes('lobster')) {
  // Add a lobster seasonality note in the TOUR TIMING section
  src = src.replace(
    '**Important Notes:**',
    `**Lobster Seasonality:**
- Lobster season runs roughly mid-June through mid-February.
- Lobster Fest is the first week of July — the island goes in the water at dawn. Worth mentioning.
- Outside season: do not promise lobster. Say "out of season right now" and offer conch or catch-of-the-day instead.

**Important Notes:**`
  );
  console.log('✓ Lobster seasonality added');
}

// ── 5. Fix weather cancellation language ─────────────────────────────────────
src = src.replace(
  /refund(able|s)?.*weather/gi,
  'credit transfer for weather cancellations — never lost, always transferable'
);

fs.writeFileSync(filePath, src, 'utf8');
console.log('\n✓ concierge/route.ts patched. Size:', src.length, 'bytes');
