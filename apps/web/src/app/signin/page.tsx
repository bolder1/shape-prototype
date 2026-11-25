import { Suspense } from "react";
import { SignInScreen } from "@/features/account/SignInScreen";

export const metadata = { title: "Sign in" };

// The screen reads ?next and ?error, so it renders inside Suspense (Next 16 search params).
export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-secondary" aria-busy="true" />}>
      <SignInScreen />
    </Suspense>
  );
}
