import type { PassportSummary } from '@shape/engine';

/** Everything the passport page shows. Built on the server for /@handle, or in the browser for the owner's preview. */
export interface PassportData {
  handle: string;
  name: string;
  headline: string | null;
  openToWork: boolean;
  since: string;
  summary: PassportSummary;
}

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
export const passportPath = (handle: string) => `/@${handle}`;
export const monthYear = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

/**
 * LinkedIn's "Add licence or certification" form, pre-filled. The learner still reviews and saves it on LinkedIn;
 * nothing is posted for them.
 */
export function linkedInCertUrl(c: { title: string; at: string; chapterId: string }, handle: string) {
  const d = new Date(c.at);
  const q = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: `${c.title}: chapter project`,
    organizationName: 'Shape',
    issueYear: String(d.getFullYear()),
    issueMonth: String(d.getMonth() + 1),
    certUrl: `${siteUrl()}${passportPath(handle)}#${c.chapterId}`,
    certId: `${handle}-${c.chapterId}`,
  });
  return `https://www.linkedin.com/profile/add?${q}`;
}
