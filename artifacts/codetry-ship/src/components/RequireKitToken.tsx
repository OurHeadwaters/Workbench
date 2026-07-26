import { type ReactNode } from "react";
import { Redirect } from "wouter";
import { getKitToken } from "@/lib/kitTokens";

interface RequireKitTokenProps {
  kitId: string;
  children: ReactNode;
}

export function RequireKitToken({ kitId, children }: RequireKitTokenProps) {
  const stored = getKitToken(kitId);
  if (!stored) {
    return <Redirect to="/parrsjars/kit?reason=access-required" />;
  }
  return <>{children}</>;
}
