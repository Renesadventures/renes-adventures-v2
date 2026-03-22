const fs = require('fs'), path = require('path');

// ── 1. Fix doubled "Belize Sales" label in custom-charter page ───────────────
const pagePath = path.join(process.cwd(), 'src', 'app', 'tours', 'custom-charter', 'page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');
const before = page.length;

page = page.replace(/Belize Sales Belize Sales Tax/g, 'Belize Sales Tax');
console.log('✓ Label fix. Changed:', before !== page.length);

fs.writeFileSync(pagePath, page, 'utf8');

// ── 2. Fix Reef Fishing pricing in tours.ts ───────────────────────────────────
const toursPath = path.join(process.cwd(), 'src', 'data', 'tours.ts');
let tours = fs.readFileSync(toursPath, 'utf8');

// Check if reef fishing has its own tour entry
if (tours.includes('reef-fishing') || tours.includes('Reef Fishing')) {
  console.log('\nFound reef fishing in tours.ts — checking price...');
  const rfIdx = tours.indexOf('reef-fishing');
  if (rfIdx !== -1) console.log(tours.slice(Math.max(0,rfIdx-30), rfIdx+250));
} else {
  console.log('\nReef Fishing is NOT a standalone tour in tours.ts');
  console.log('It is an activity option on Custom Charter only — no price update needed in tours.ts');
}

// ── 3. Check TourLandingClient for any reef fishing hardcoded price ───────────
const clientPath = path.join(process.cwd(), 'src', 'app', 'tours', '[slug]', 'TourLandingClient.tsx');
if (fs.existsSync(clientPath)) {
  let client = fs.readFileSync(clientPath, 'utf8');
  
  // Find pricing section around reef fishing
  const matches = [...client.matchAll(/reef.fishing/gi)];
  matches.forEach(m => {
    console.log('\n--- TourLandingClient context at', m.index, '---');
    console.log(client.slice(Math.max(0, m.index - 100), m.index + 300));
  });
  
  // Fix reef fishing price if found — full day $600, half day $400
  // Deep sea is $600/$900 — reef fishing is different ($400/$600 per Chris)
  // But reef fishing is NOT a separate tour slug, it's part of custom charter
  // The [slug] page only handles: deep-sea-fishing, sunset-cruise, blue-hole, secret-beach
}

console.log('\n=== Summary ===');
console.log('Reef Fishing ($600 full / $400 half) per Chris refers to reef-fishing');
console.log('as a STANDALONE tour on the [slug] page if it exists, or as an activity.');
console.log('Run: Get-Content "src\\app\\tours\\[slug]\\page.tsx" | Select-String "reef" to check.');
