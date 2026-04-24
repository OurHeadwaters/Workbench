import { createRoot } from "react-dom/client";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import App from "./App";
import { getOwnerToken, setOwnerToken } from "./lib/ownerAuth";
import "./index.css";

// Forward the curator's owner token (stored in localStorage) on every API
// request as `Authorization: Bearer <token>`.  The server validates it
// against LIBRARY_OWNER_TOKEN.  Returning null means no header is added,
// which is what we want for the unauthenticated /share/:token page.
setAuthTokenGetter(() => getOwnerToken());

// Auto-logout on 401 responses so a stale token doesn't keep the curator
// stuck on a broken page.  Wraps the global fetch — runs before React
// Query sees the response.
const originalFetch = window.fetch.bind(window);
window.fetch = async (...args) => {
  const res = await originalFetch(...args);
  if (res.status === 401) {
    const url =
      typeof args[0] === "string"
        ? args[0]
        : args[0] instanceof URL
          ? args[0].toString()
          : args[0] instanceof Request
            ? args[0].url
            : "";
    // Only react to library API 401s (not /share-links/by-token, not /storage,
    // not unrelated fetches), and only if we currently *think* we're logged in.
    if (
      url.includes("/api/library/") &&
      !url.includes("/api/library/share-links/by-token/") &&
      !url.includes("/api/library/owner/login") &&
      getOwnerToken()
    ) {
      setOwnerToken(null);
    }
  }
  return res;
};

createRoot(document.getElementById("root")!).render(<App />);
