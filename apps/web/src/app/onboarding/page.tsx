import { OnboardingExperience } from "@/features/onboarding/OnboardingExperience";

export const metadata = { title: "Map your skills" };

// A short 3D story along the road from idea to launch (docs/05-onboarding-story.md).
export default function OnboardingPage() {
  return <OnboardingExperience />;
}
