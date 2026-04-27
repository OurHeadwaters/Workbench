import { useLocation, Link } from "wouter";
import { Layers, Cloud, CloudOff, LogOut } from "lucide-react";
import { useAuth, useUser, useClerk, ClerkLoaded } from "@clerk/react";

// `clerkEnabled` is required (not optional) so callers can't accidentally
// render this component without declaring whether Clerk is wired up. When
// false, no Clerk hook is called and no auth UI is shown — the bar is safe
// to render outside a ClerkProvider.
export function TopBar({ clerkEnabled }: { clerkEnabled: boolean }) {
  const [location] = useLocation();
  const onHome = location === "/";
  const onAuthPage =
    location.startsWith("/sign-in") || location.startsWith("/sign-up");
  return (
    <header
      className="border-b"
      style={{ borderColor: "var(--color-rule)", backgroundColor: "var(--color-cream)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 no-underline"
          style={{ color: "var(--color-ink)" }}
          data-testid="link-home"
        >
          <Layers size={20} strokeWidth={1.6} />
          <div>
            <p className="eyebrow leading-none mb-1">Practitioner tool</p>
            <p
              className="text-xl leading-none"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}
            >
              Wordpile
            </p>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          {!onHome && !onAuthPage && (
            <Link href="/" className="link" data-testid="link-piles">
              All piles
            </Link>
          )}
          {clerkEnabled && !onAuthPage && <AuthControls />}
        </div>
      </div>
    </header>
  );
}

function AuthControls() {
  return (
    <ClerkLoaded>
      <AuthControlsInner />
    </ClerkLoaded>
  );
}

function AuthControlsInner() {
  const { isSignedIn } = useAuth();
  return isSignedIn ? <SignedInBar /> : <SignedOutBar />;
}

function SignedOutBar() {
  return (
    <Link
      href="/sign-in"
      className="link inline-flex items-center gap-2"
      data-testid="link-sign-in"
      style={{ color: "var(--color-ink)" }}
      title="Sign in to sync your piles across devices"
    >
      <CloudOff size={16} strokeWidth={1.6} />
      <span>Sign in to sync</span>
    </Link>
  );
}

function SignedInBar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    "Signed in";
  return (
    <div className="flex items-center gap-3">
      <span
        className="inline-flex items-center gap-2 text-sm"
        style={{ color: "var(--color-stone)" }}
        data-testid="text-current-user"
        title="Your piles are syncing to your account"
      >
        <Cloud size={14} strokeWidth={1.6} />
        <span className="hidden sm:inline">{email}</span>
      </span>
      <button
        type="button"
        onClick={() => signOut()}
        className="link inline-flex items-center gap-1"
        data-testid="button-sign-out"
        style={{ color: "var(--color-ink)" }}
        title="Sign out"
      >
        <LogOut size={14} strokeWidth={1.6} />
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </div>
  );
}
