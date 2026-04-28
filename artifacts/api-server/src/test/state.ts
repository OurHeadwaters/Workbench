// Mutable test state shared between vi.mock factories and the test bodies.
//
// vi.mock factories are hoisted, so they cannot reference variables defined
// later in the test file.  But they CAN run `await import(...)` against an
// unmocked sibling module — and so can the test bodies.  By stashing the
// "current Clerk user" and identity table here, both sides of the test
// see the same object and stay in sync without globals.

export interface FakeIdentity {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

export const state = {
  authUserId: null as string | null,
  identities: new Map<string, FakeIdentity>(),
};

export function setUser(clerkUserId: string | null): void {
  state.authUserId = clerkUserId;
}

export function setIdentity(
  clerkUserId: string,
  email: string,
  opts: { firstName?: string | null; lastName?: string | null } = {},
): void {
  state.identities.set(clerkUserId, {
    email,
    firstName: opts.firstName ?? null,
    lastName: opts.lastName ?? null,
  });
}

export function resetState(): void {
  state.authUserId = null;
  state.identities.clear();
}
