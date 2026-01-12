type LiaTale = {
  legend: string;
};

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pick<T>(arr: T[], seed: string): T {
  const idx = arr.length ? hashString(seed) % arr.length : 0;
  return arr[idx] as T;
}

function inferVibeFromPath(src: string) {
  const s = src.toLowerCase();

  if (s.includes('sailfish') || s.includes('marlin') || s.includes('wahoo') || s.includes('offshore')) {
    return { motif: 'bluewater', noun: 'blue water' };
  }
  if (s.includes('reef') || s.includes('barrier') || s.includes('coral')) {
    return { motif: 'reef', noun: 'reef line' };
  }
  if (s.includes('sunset') || s.includes('golden') || s.includes('dusk')) {
    return { motif: 'sunset', noun: 'golden hour' };
  }
  if (s.includes('bbq') || s.includes('barbecue') || s.includes('grill') || s.includes('burger') || s.includes('sausage')) {
    return { motif: 'bbq', noun: 'dockside grill' };
  }
  if (s.includes('beach') || s.includes('kayak') || s.includes('party')) {
    return { motif: 'beach', noun: 'shallow turquoise' };
  }
  if (s.includes('blue-hole')) {
    return { motif: 'bluehole', noun: 'the Blue Hole' };
  }
  if (s.includes('tarpon')) {
    return { motif: 'tarpon', noun: 'the mangroves' };
  }

  return { motif: 'caribbean', noun: 'the Caribbean' };
}

export function buildLiasTaleForAsset(src: string): LiaTale {
  const vibe = inferVibeFromPath(src);
  const seed = `lia-tale|${src}`;

  const openers = [
    'Lia’s Tale:',
    'Lia’s Tale:',
    'Lia’s Tale:',
  ];

  const framesByMotif: Record<string, string[]> = {
    bluewater: [
      'We left the calm inside water and aimed the bow toward {noun}. The sea was alive—quiet, then electric.',
      'René watched the horizon and said, “Give it ten minutes.” Out on {noun}, the next strike is always a surprise.',
    ],
    reef: [
      'The wind had opinions, so René tucked us in tight along the {noun}—protected water, nonstop action.',
      'On the {noun}, every drop has a story. Snapper, grouper, and that steady Caribbean rhythm.',
    ],
    sunset: [
      'By {noun}, the whole island goes cinematic. No rush—just salt air, laughter, and the sky turning gold.',
      'René pointed west and smiled. “This is when Belize starts telling the truth.” {noun} did the rest.',
    ],
    bbq: [
      'Back at the {noun}, the day turned into a feast—smoke, spice, and a table full of new friends.',
      'The grill was hot, the stories were hotter. A perfect finish: {noun} and a breeze off the water.',
    ],
    beach: [
      'We traded open chop for {noun} and let the island reset our nervous systems—sun, smiles, and easy water.',
      'Some days are about trophies. Some are about {noun}. René knows exactly which one you need.',
    ],
    bluehole: [
      'We ran early and fast. Out at {noun}, the water shifts from turquoise to deep ink in one breath.',
      'At {noun}, the ocean feels ancient. René kept it calm: “Stay close. Look down. You’ll remember this forever.”',
    ],
    tarpon: [
      'When the breeze gets sharp, René moves the game to {noun}. Calm pockets. Big energy.',
      'In {noun}, the bite can be sudden—silver flashes, tight lines, and everyone yelling at once.',
    ],
    caribbean: [
      'Belize doesn’t do “ordinary.” One moment, it’s calm. The next, {noun} is writing your memory for you.',
      'René’s rule is simple: follow the conditions, not the plan. That’s how {noun} turns into a legend.',
    ],
  };

  const closers = [
    'That’s the kind of day you replay on the flight home.',
    'Save this one. You’ll be back for it.',
    'The photo is proof—but the feeling is the real souvenir.',
  ];

  const frame = pick(framesByMotif[vibe.motif] || framesByMotif.caribbean, seed).replace('{noun}', vibe.noun);
  const closer = pick(closers, `${seed}|closer`);
  const opener = pick(openers, `${seed}|opener`);

  return {
    legend: `${opener} ${frame} ${closer}`,
  };
}
