import { ClientOnly } from "./ClientOnly";

export const metadata = { title: "Your syllabus" };

// Where the learner tunes their path: chapters, skill levels, goal and pace.
export default function SyllabusPage() {
  return <ClientOnly />;
}
