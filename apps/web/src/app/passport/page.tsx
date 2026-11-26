import { ClientOnly } from "./ClientOnly";

export const metadata = { title: "Skill Passport" };

export default function PassportPage() {
  return <ClientOnly />;
}
