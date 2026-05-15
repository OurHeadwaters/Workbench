import { useState, useEffect } from "react";
import { type LibraryEntry } from "@workspace/api-client-react";
import { entryAssetUrl } from "@/lib/utils";
import { getOwnerToken } from "@/lib/ownerAuth";

/**
 * Returns a short-lived signed URL for a private object-storage asset so the
 * curator's browser can load it via plain <img src> / <iframe src> without
 * embedding the long-lived owner token in the URL.
 *
 * For external URLs (e.g. a screenshotUrl pointing to a public CDN) the URL
 * is returned as-is because no signing is needed.
 *
 * Returns null while the signed URL is being fetched, or if the entry has no
 * asset, or if the user is not logged in.
 */
export function useSignedAssetUrl(entry: LibraryEntry | undefined): string | null {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    const rawUrl = entryAssetUrl(entry);
    if (!rawUrl) {
      setSignedUrl(null);
      return;
    }

    // External screenshot URLs (no object-storage path) are already public
    if (!rawUrl.includes("/api/storage/objects/")) {
      setSignedUrl(rawUrl);
      return;
    }

    const token = getOwnerToken();
    if (!token) {
      setSignedUrl(null);
      return;
    }

    // Derive the object path from the asset URL:
    // /api/storage/objects/xxx  →  /objects/xxx
    const objectPath = rawUrl.replace("/api/storage", "");

    let cancelled = false;
    setSignedUrl(null);

    fetch(`/api/storage/signed-url?path=${encodeURIComponent(objectPath)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? (r.json() as Promise<{ signedUrl: string }>) : null))
      .then((data) => {
        if (!cancelled && data?.signedUrl) {
          setSignedUrl(data.signedUrl);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [entry?.id, entry?.screenshotObjectPath, entry?.storageRef, entry?.kind]);

  return signedUrl;
}
