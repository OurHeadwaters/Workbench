// Ensure cookies travel with all requests (admin auth)
const orig = globalThis.fetch.bind(globalThis);
globalThis.fetch = ((input: RequestInfo | URL, init: RequestInit = {}) => {
  return orig(input, { credentials: "include", ...init });
}) as typeof fetch;

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
