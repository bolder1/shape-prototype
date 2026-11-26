'use client';
import { PrinterIcon } from '@phosphor-icons/react/ssr';

/** Opens the browser's print dialog, where "Save as PDF" makes the file. */
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl bg-[#101828] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#344054]">
      <PrinterIcon className="size-4" weight="bold" />Save as PDF
    </button>
  );
}
