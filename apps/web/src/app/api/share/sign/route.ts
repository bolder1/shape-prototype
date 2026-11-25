import { NextResponse, type NextRequest } from 'next/server';
import { decodeShare } from '@/lib/share';
import { signCode } from '@/lib/share-sign';

// Signs a grade-card code. Only codes that decode to a real lesson with in-range numbers are signed.
// TODO (Release 1, passport step): sign only results the server has seen in the learner's own event log, so a
// hand-made code can't be laundered into a verified one. Until then "verified" means "well-formed and issued here".
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { code?: unknown } | null;
  const code = typeof body?.code === 'string' ? body.code.split('.')[0] : '';
  if (!decodeShare(code)) return NextResponse.json({ error: 'invalid code' }, { status: 400 });
  return NextResponse.json({ code: await signCode(code) });
}
