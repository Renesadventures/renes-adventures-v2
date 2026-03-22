const fs = require('fs'), path = require('path');
const filePath = path.join(process.cwd(), 'src', 'app', 'tours', 'custom-charter', 'page.tsx');
let src = fs.readFileSync(filePath, 'utf8');

// Fix doubled label
src = src.replace('Belize Sales Belize Sales Tax (12.5%)', 'Belize Sales Tax (12.5%)');

// Also fix in case it appears elsewhere
const count = (src.match(/Belize Sales Tax/g) || []).length;
console.log('Occurrences of "Belize Sales Tax":', count);

fs.writeFileSync(filePath, src, 'utf8');
console.log('Fixed. Size:', src.length);
