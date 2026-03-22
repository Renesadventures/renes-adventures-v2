const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'app', 'tours', 'custom-charter', 'page.tsx');
let src = fs.readFileSync(filePath, 'utf8');

console.log('File size on disk:', src.length);

// Show current tax block
const taxIdx = src.indexOf('const tax = useMemo');
console.log('\nCurrent tax block:\n' + src.slice(taxIdx, taxIdx + 280) + '\n');

// Replace old 6%-of-base calc with sequential calc
const old1 = `const tax = useMemo(() => subtotal * 0.125, [subtotal]);
  const serviceFee = useMemo(() => subtotal * 0.06, [subtotal]);
  const liveTotal = useMemo(() => subtotal + tax + serviceFee, [serviceFee, subtotal, tax]);`;

const old2 = `const tax = useMemo(() => subtotal * 0.125, [subtotal]);
  const subtotalAfterTax = useMemo(() => subtotal + tax, [subtotal, tax]);
  const serviceFee = useMemo(() => subtotalAfterTax * 0.06, [subtotalAfterTax]);
  const liveTotal = useMemo(() => subtotalAfterTax + serviceFee, [subtotalAfterTax, serviceFee]);`;

const correct = `// Sequential tax per Chris Carter 3/9/2026: 12.5% on base, then 6% on base+tax
  const tax = useMemo(() => subtotal * 0.125, [subtotal]);
  const subtotalAfterTax = useMemo(() => subtotal + tax, [subtotal, tax]);
  const serviceFee = useMemo(() => subtotalAfterTax * 0.06, [subtotalAfterTax]);
  const liveTotal = useMemo(() => subtotalAfterTax + serviceFee, [subtotalAfterTax, serviceFee]);`;

if (src.includes(old1)) {
  src = src.replace(old1, correct);
  console.log('PATCHED: replaced old single-step calculation');
} else if (src.includes(old2)) {
  // Already sequential but missing the comment — add it to force git diff
  src = src.replace(old2, correct);
  console.log('PATCHED: added comment to force git diff (logic was already sequential)');
} else {
  console.log('ERROR: Could not find tax pattern — manual fix needed');
  process.exit(1);
}

// Fix sidebar labels
src = src.replace(/Tax \(12\.5%\)/g, 'Belize Sales Tax (12.5%)');
src = src.replace(/Service Fee \(6%\)/g, 'Card Processing Fee (6%)');

fs.writeFileSync(filePath, src, 'utf8');
console.log('File written. New size:', src.length);

// Verify
const sub = 825;
const t = +(sub * 0.125).toFixed(2);
const afterT = sub + t;
const fee = +(afterT * 0.06).toFixed(2);
console.log('\n=== Math check: 6 guests, full day ===');
console.log('Subtotal:   $' + sub.toFixed(2));
console.log('Tax 12.5%:  $' + t.toFixed(2));
console.log('After tax:  $' + afterT.toFixed(2));
console.log('Fee 6%:     $' + fee.toFixed(2));
console.log('TOTAL:      $' + (afterT + fee).toFixed(2));
