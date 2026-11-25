import { ClientOnly } from "./ClientOnly";

export const metadata = {
  title: "Daily Brief",
  description: "Five design questions a day, the same for everyone. Play in two minutes, share your squares.",
};

export default function DailyPage() {
  return <ClientOnly />;
}
