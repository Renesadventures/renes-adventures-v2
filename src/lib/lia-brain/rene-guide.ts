/** The launch uses a fixed reply so a guide request always gets the right link. */
const PUBLIC_GUIDE_URL = 'https://www.renesadventures.tours/belize-like-a-local.pdf';

export function reneGuideReply(
  text: string,
  guideUrl = process.env.RENE_GUIDE_URL ?? (process.env.VERCEL_ENV === 'production' ? PUBLIC_GUIDE_URL : ''),
): string | null {
  if (!/^ren[eé][.!?]*$/iu.test(text.trim().normalize('NFC')) || !guideUrl) return null;

  let url: URL;
  try {
    url = new URL(guideUrl);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
  } catch {
    return null;
  }

  return [
    'Hey, glad you found us! Welcome to our little corner of Belize. Here’s your island guide with our favorite spots for reef time, good food and a night out.',
    url.href,
    'When are you coming down, and how many are in your crew? I’d love to get you out on the water. Send me your dates and I’ll help you pick the right private charter.',
    'See you in Belize! 🇧🇿',
  ].join('\n\n');
}
