const fs = require('fs');
let s = fs.readFileSync('src/components/home/BelizeDiscovery.tsx', 'utf8');
s = s.replace(
  onClick={() => {
              const btn = document.querySelector('[data-lia-trigger]') as HTMLElement;
              btn?.click();
            }},
  onClick={() => {
              window.dispatchEvent(new CustomEvent('lia:open', { detail: { message: "I just read about Belize — the Blue Hole, the Garifuna, the Maya ruins, lobster season. I don't even know where to start. What would you say is the one experience that changes people the most?" } }));
            }}
);
fs.writeFileSync('src/components/home/BelizeDiscovery.tsx', s, 'utf8');
console.log(s.includes('lia:open') ? 'SUCCESS' : 'FAILED');
