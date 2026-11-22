// Share codes: an episode result packed into a URL-safe string, so a grade card can be shared without accounts.
// The share page and image route are public and the code is user-editable, so everything is validated on the way in:
// lesson titles always come from our content (never from the code), numbers are bounded, and the name is cleaned and capped.
// Not signed: a determined person can fake a card. Fine for a prototype brag card; sign it once accounts exist.
import { z } from 'zod';
import { chapterById } from '@shape/engine';
import { lessonById, parseLessonId } from '@shape/content';

const ShareData = z.object({
  l: z.string().regex(/^[a-z]{2}\.\d+-\d+$/),     // lesson id
  g: z.enum(['S', 'A', 'B', 'C', 'D']),           // grade
  p: z.number().int().min(0).max(100),            // percent
  r: z.number().int().min(0).max(99),             // right
  t: z.number().int().min(1).max(99),             // total
  x: z.number().int().min(0).max(999),            // xp
  s: z.number().int().min(0).max(9999),           // streak (days)
  n: z.string().max(40),                          // first name
  d: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),     // date
}).refine(v => v.r <= v.t);
export type ShareData = z.infer<typeof ShareData>;

/** Keeps a display name safe and short: no control characters, collapsed spaces, at most 24 characters. */
export const cleanName = (name: string) => name.replace(/[\p{C}<>]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 24) || 'A learner';

// base64url over UTF-8 (names can be in any script), working in both the browser and Node.
const toB64Url = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64Url = (s: string) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)));

export function encodeShare(data: ShareData): string {
  return toB64Url(JSON.stringify({ ...data, n: cleanName(data.n) }));
}

/** The decoded share, plus everything the card needs from our own content. `null` for anything invalid. */
export function decodeShare(code: string) {
  if (!/^[A-Za-z0-9_-]{10,600}$/.test(code)) return null;
  try {
    const parsed = ShareData.safeParse(JSON.parse(fromB64Url(code)));
    if (!parsed.success) return null;
    const data = { ...parsed.data, n: cleanName(parsed.data.n) };
    const lesson = lessonById(data.l);
    if (!lesson) return null;
    const { chapterId, n } = parseLessonId(data.l);
    return { ...data, title: lesson.title, chapter: chapterById[chapterId]?.title ?? '', href: `/learn/${chapterId}/${n}` };
  } catch {
    return null;
  }
}
export type DecodedShare = NonNullable<ReturnType<typeof decodeShare>>;
