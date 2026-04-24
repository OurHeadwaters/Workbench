import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type LibraryEntry } from "@workspace/api-client-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function entryAssetUrl(entry: LibraryEntry | undefined): string | null {
  if (!entry) return null;
  if (entry.kind === "web_source") {
    if (entry.screenshotObjectPath) {
      return `/api/storage${entry.screenshotObjectPath}`;
    }
    return entry.screenshotUrl || null;
  }
  
  if (entry.storageRef) {
    if (entry.storageRef.startsWith("gcs:")) {
      return `/api/storage${entry.storageRef.replace(/^gcs:/, '')}`;
    }
    if (entry.storageRef.startsWith("attached:")) {
      return `/api/storage/public-objects/attached_assets/${entry.storageRef.replace(/^attached:/, '')}`;
    }
  }
  return null;
}

export function errMessage(err: unknown, fallback = "Something went wrong"): string {
  if (err instanceof Error) return err.message || fallback;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return fallback;
}

export function computeFileHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        if (!buffer) return resolve("");
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(hashHex);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
