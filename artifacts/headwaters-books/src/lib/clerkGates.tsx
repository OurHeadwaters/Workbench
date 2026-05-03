import { type ReactNode, useEffect } from "react";
import { useAuth, ClerkLoaded } from "@clerk/react";
import { useLocation } from "wouter";

export function SignedIn({ children }: { children: ReactNode }) {
  return (
    <ClerkLoaded>
      <SignedInInner>{children}</SignedInInner>
    </ClerkLoaded>
  );
}

function SignedInInner({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  return isSignedIn ? <>{children}</> : null;
}

export function SignedOut({ children }: { children: ReactNode }) {
  return <SignedOutInner>{children}</SignedOutInner>;
}

function SignedOutInner({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  // Optimistic: assume signed-out until Clerk confirms the user IS signed in.
  // This ensures sign-in buttons always render even when Clerk is slow to
  // initialize or the domain has not yet been whitelisted in the Clerk dashboard.
  if (isLoaded && isSignedIn) return null;
  return <>{children}</>;
}

export function RedirectToSignIn() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/sign-in");
  }, [setLocation]);
  return null;
}
