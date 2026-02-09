/**
 * 🔒 TOUR PAGE TEMPLATE LOCK SYSTEM
 *
 * LOCKED: 2025-02-08 at 9:30 AM EST
 *
 * The following components are LOCKED and cannot be modified:
 * 1. Page structure (src/app/tours/[slug]/page.tsx)
 * 2. Icon mapping (itemIconFor function)
 * 3. Add-on quantity initialization
 * 4. Gallery grid layout
 * 5. Video fallback handling
 *
 * ALLOWED MODIFICATIONS:
 * - Tour content (titles, descriptions, pricing)
 * - Images/videos (URLs only)
 * - Add-on items (from centralized data)
 *
 * FORBIDDEN MODIFICATIONS:
 * - Component structure
 * - Icon logic
 * - Layout grid
 * - Portal timing
 * - Gallery rendering
 *
 * To request template changes, contact the dev team.
 */

export interface PageLock {
  slug: string;
  structureLocked: boolean;
  lockedAt: string;
  isTemplate?: boolean;
  templateSource?: string;
  approvedBy?: string;
}

export const LOCKED_TOURS: PageLock[] = [
  {
    slug: 'custom-charter',
    structureLocked: true,
    lockedAt: '2025-02-07',
    approvedBy: 'erika',
  },
  {
    slug: 'deep-sea-fishing',
    structureLocked: true,
    lockedAt: '2025-02-08',
    templateSource: 'reef-fishing',
    approvedBy: 'erika',
  },
  {
    slug: 'sunset-cruise',
    structureLocked: true,
    lockedAt: '2025-02-08',
    templateSource: 'reef-fishing',
    approvedBy: 'erika',
  },
  {
    slug: 'blue-hole',
    structureLocked: true,
    lockedAt: '2025-02-08',
    templateSource: 'reef-fishing',
    approvedBy: 'erika',
  },
  {
    slug: 'secret-beach',
    structureLocked: true,
    lockedAt: '2025-02-08',
    templateSource: 'reef-fishing',
    approvedBy: 'erika',
  },
];

export function isTourLocked(slug: string): boolean {
  return LOCKED_TOURS.some((lock) => lock.slug === slug && lock.structureLocked);
}

export function getTourLock(slug: string): PageLock | undefined {
  return LOCKED_TOURS.find((lock) => lock.slug === slug);
}

export function getTemplateSource(slug: string): string | undefined {
  return getTourLock(slug)?.templateSource;
}

export function isTemplate(slug: string): boolean {
  return getTourLock(slug)?.isTemplate === true;
}
