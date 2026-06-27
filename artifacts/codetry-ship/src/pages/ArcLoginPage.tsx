import { ClerkProvider, SignIn } from "@clerk/react";
import { useLocation } from "wouter";

function ClerkWouterAdapter({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      routerPush={(to) => setLocation(to)}
      routerReplace={(to) => setLocation(to)}
      appearance={{
        variables: {
          colorPrimary: "hsl(160 40% 25%)",
          colorBackground: "hsl(40 33% 98%)",
          colorText: "hsl(160 40% 15%)",
          colorDanger: "hsl(0 70% 50%)",
          colorInputBackground: "hsl(40 33% 98%)",
          colorInputText: "hsl(160 40% 15%)",
          borderRadius: "0.5rem",
        },
        elements: {
          cardBox:
            "shadow-md border border-[hsl(40_20%_85%)] rounded-lg overflow-hidden",
          card: "bg-[hsl(40_33%_98%)]",
          footer: "bg-[hsl(40_20%_92%)] border-t border-[hsl(40_20%_85%)]",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export function ArcLoginPage() {
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  const returnTo = params.get("returnTo") ?? "/";

  return (
    <ClerkWouterAdapter>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(40_33%_98%)] px-4">
        <div className="mb-8 text-center">
          <img
            src="/headwaters-logo.svg"
            alt="Headwaters"
            className="h-10 mx-auto mb-3"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <p className="text-sm text-[hsl(160_20%_45%)] tracking-wide uppercase">
            Sign in to continue
          </p>
        </div>
        <SignIn
          forceRedirectUrl={returnTo}
          fallbackRedirectUrl={returnTo}
          routing="hash"
        />
      </div>
    </ClerkWouterAdapter>
  );
}
