/**
 * Central social presence config.
 * Single source of truth for footer links, JSON-LD sameAs, and share targets.
 *
 * HOW TO ACTIVATE A CHANNEL:
 *   1. Create/confirm the account.
 *   2. Paste the public profile URL into `href`.
 *   3. Flip `enabled` to true.
 * Footer + structured data only surface channels where enabled === true,
 * so nothing broken ever renders on the live site.
 */

export type SocialPlatform = 'facebook' | 'instagram' | 'tiktok' | 'youtube';

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
  handle: string;
  enabled: boolean;
}

export const socialLinks: SocialLink[] = [
  {
    platform: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/renesadventures',
    handle: '@renesadventures',
    enabled: true,
  },
  {
    platform: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/renes.adventures',
    handle: '@renes.adventures',
    enabled: true,
  },
  {
    platform: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@renesadventures',
    handle: '@renesadventures',
    enabled: false, // TODO: flip once the TikTok account is created
  },
  {
    platform: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/@renesadventures',
    handle: '@renesadventures',
    enabled: false, // TODO: flip once the YouTube channel is created
  },
];

export const activeSocialLinks = () => socialLinks.filter((s) => s.enabled);
export const socialSameAs = () => activeSocialLinks().map((s) => s.href);
