import { ClientOnly } from "./ClientOnly";

export const metadata = { title: "Home" };

// The learner's home: continue card, streak, XP, review deck and path.
export default function PlayPage() {
  return <ClientOnly />;
}
