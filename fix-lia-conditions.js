const fs = require('fs');
let s = fs.readFileSync('src/components/home/ConditionsWidget.tsx', 'utf8');
s = s.replace(
  'onClick={() => setLiaMessage(`Great choice! ${pick.recommendation}. ${pick.reasoning} Want me to help you book?`)}',
  'onClick={() => { window.dispatchEvent(new CustomEvent("lia:open", { detail: { message: `The weather looks good for ${pick.title}. ${pick.recommendation} — what should I know before I commit to this trip? What do guests usually ask you about this one?` } })); }}'
);
fs.writeFileSync('src/components/home/ConditionsWidget.tsx', s, 'utf8');
console.log(s.includes('lia:open') ? 'SUCCESS' : 'FAILED');
