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
  return (
    <ClerkLoaded>
      <SignedOutInner>{children}</SignedOutInner>
    </ClerkLoaded>
  );
}

function SignedOutInner({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  return !isSignedIn ? <>{children}</> : null;
}

export function RedirectToSignIn() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/sign-in");
  }, [setLocation]);
  return null;
}
