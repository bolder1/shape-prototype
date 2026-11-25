import { OnboardingExperience } from "@/features/onboarding/OnboardingExperience";

export const metadata = { title: "Set up your plan" };

// A short survey, one question per screen, that builds the learner's path (features/onboarding/survey).
export default function OnboardingPage() {
  return <OnboardingExperience />;
}
