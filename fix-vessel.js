const fs = require('fs');
let s = fs.readFileSync('src/components/home/VesselShowcase.tsx', 'utf8');
const before = s.length;
s = s.replace(/[^}]*beach-bon-fire-two[^}]*},?/g, '');
s = s.replace(/[^}]*beach-bon-fire[^}]*},?/g, '');
fs.writeFileSync('src/components/home/VesselShowcase.tsx', s, 'utf8');
console.log('removed, chars before/after:', before, s.length);
