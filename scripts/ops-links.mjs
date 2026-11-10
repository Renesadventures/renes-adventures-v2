// Mint private links for the Ops report (Faro-style).
//
//   OPS_LINK_SECRET=... node scripts/ops-links.mjs [https://www.renesadventures.tours] [days]
//
// Prints one link per person. Never commit the output; keep it in the
// Control Room _KEYS folder. To kill every old link, set OPS_LINKS_NOT_BEFORE
// in Vercel to the current unix time and mint new ones.
import crypto from 'node:crypto';

const base = (process.argv[2] || 'https://www.renesadventures.tours').replace(/\/$/, '');
const days = Number(process.argv[3] || 365);
const secret = process.env.OPS_LINK_SECRET || '';
if (secret.length < 24) {
  console.error('Set OPS_LINK_SECRET (24+ chars) first.');
  process.exit(1);
}
const people = [
  { n: 'Eddy', v: 'full' },
  { n: 'Chris', v: 'owner' },
  { n: 'Rene', v: 'owner' },
];
const now = Math.floor(Date.now() / 1000);
for (const p of people) {
  const body = Buffer.from(JSON.stringify({ n: p.n, v: p.v, i: now, e: now + days * 86400 })).toString('base64url');
  const mac = crypto.createHmac('sha256', secret).update(body).digest('base64url').slice(0, 32);
  console.log(`${p.n} (${p.v} view): ${base}/ops?t=${body}.${mac}`);
}
