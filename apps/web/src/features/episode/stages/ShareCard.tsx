'use client';
// Share a grade card. On phones that can share files, the card image goes straight into the share sheet (WhatsApp,
// Instagram, LinkedIn…) with the link; otherwise the link is shared or copied. The image can always be downloaded.
import { useState } from 'react';
import { CheckIcon, DownloadSimpleIcon, ShareNetworkIcon } from '@phosphor-icons/react/ssr';
import { Button } from '@/components/base/buttons/button';
import { encodeShare, type ShareData } from '@/lib/share';

export function ShareCard({ data, title, label }: { data: ShareData; title: string; label: string }) {
  const [status, setStatus] = useState<'idle' | 'working' | 'copied' | 'shared'>('idle');
  const code = encodeShare(data);
  const image = `/api/card/${code}`;
  const text = `I scored ${data.g} (${label}) on “${title}” on Shape. Can you beat it?`;

  const share = async () => {
    setStatus('working');
    const url = `${window.location.origin}/s/${code}`;
    try {
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], `shape-grade-${data.g}.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'My Shape grade card', text: `${text} ${url}` });
        setStatus('shared'); return;
      }
      if (navigator.share) { await navigator.share({ title: 'My Shape grade card', text, url }); setStatus('shared'); return; }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setStatus('copied');
    } catch {
      // Closing the share sheet (AbortError) or a blocked clipboard: nothing worth an error, just let them try again.
      setStatus('idle');
    }
  };

  return (
    <>
      <Button size="lg" color="secondary" iconLeading={status === 'copied' || status === 'shared' ? CheckIcon : ShareNetworkIcon} onPress={share} isDisabled={status === 'working'}>
        {status === 'copied' ? 'Link copied' : status === 'shared' ? 'Shared' : status === 'working' ? 'Preparing…' : 'Share my card'}
      </Button>
      <a href={image} download={`shape-grade-${data.g}.png`}
        className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-md font-semibold text-tertiary transition hover:bg-primary_hover hover:text-secondary">
        <DownloadSimpleIcon className="size-5" weight="bold" />Download image
      </a>
    </>
  );
}
