import { ClientOnly } from "./ClientOnly";

export const metadata = { title: "League" };

// This week's league: your tier, the table, and who moves up or down on Monday.
export default function LeaguePage() {
  return <ClientOnly />;
}
