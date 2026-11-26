import 'server-only';
// Signs share codes so a card (and, next, a credential) can be checked as really issued by Shape.
// A signed code is `<code>.<sig>`: sig = HMAC-SHA256(code) with SHARE_SIGNING_SECRET, base64url, first 16 bytes.
// Without the secret nothing is signed and every card shows as unverified; old unsigned links keep working.

const enc = new TextEncoder();
const b64url = (buf: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function hmac(code: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url((await crypto.subtle.sign('HMAC', key, enc.encode(code))).slice(0, 16));
}

/** Constant-time compare, so the signature can't be guessed one character at a time. */
function same(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

export const signingEnabled = () => !!process.env.SHARE_SIGNING_SECRET;

/** `code.sig`, or the bare code when signing is off. */
export async function signCode(code: string) {
  const secret = process.env.SHARE_SIGNING_SECRET;
  return secret ? `${code}.${await hmac(code, secret)}` : code;
}

/** True only for a code carrying a valid signature. */
export async function verifyCode(signed: string) {
  const secret = process.env.SHARE_SIGNING_SECRET;
  const [code, sig] = signed.split('.');
  if (!secret || !code || !sig) return false;
  return same(sig, await hmac(code, secret));
}

// ——— Receipts ———
// A receipt is a signature over a list of fields, issued by a server route when it does something worth trusting
// later (an AI project review). Fields are joined with "|", which no field may contain.

/** Signature for these fields, or null when signing is off. */
export async function signFields(fields: string[]) {
  const secret = process.env.SHARE_SIGNING_SECRET;
  if (!secret || fields.some(f => f.includes('|'))) return null;
  return hmac(fields.join('|'), secret);
}

/** True only when `sig` is the signature for exactly these fields. */
export async function verifyFields(fields: string[], sig: unknown) {
  const secret = process.env.SHARE_SIGNING_SECRET;
  if (!secret || typeof sig !== 'string' || fields.some(f => f.includes('|'))) return false;
  return same(sig, await hmac(fields.join('|'), secret));
}

/** The fields a project-review receipt covers: who, which project, what verdict, when. */
export const bossReceiptFields = (userId: string, chapterId: string, verdict: string, percent: number, at: string) =>
  ['boss', userId, chapterId, verdict, String(percent), at];
