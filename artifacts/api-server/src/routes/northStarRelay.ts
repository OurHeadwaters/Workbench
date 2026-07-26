/**
 * North Star Relay Publisher — server-side Nostr event signing and publishing
 *
 * POST /api/north-star/relay/publish
 *   Accepts a North Star event, constructs a canonical Nostr wire event,
 *   signs it with the system private key, and publishes it to the configured
 *   relay via WebSocket.
 *
 * Config (server-side env vars — never exposed to the browser):
 *   SYSTEM_NSEC    — hex-encoded secp256k1 private key (32 bytes → 64 hex chars)
 *   RELAY_URL      — wss:// address of the Nostr relay
 *
 * When either env var is absent the endpoint returns 501 so the client can
 * fall back to its localStorage stub without losing data.
 *
 * Auth: owner token (x-library-owner-token header) required.
 */

import { Router, type IRouter, type Request, type Response } from "express";
import { sha256 } from "@noble/hashes/sha2";
import { schnorr } from "@noble/curves/secp256k1";
import { bytesToHex, hexToBytes } from "@noble/curves/utils";
import { isOwnerRequest } from "../lib/ownerAuth";
import WebSocket from "ws";

const router: IRouter = Router();

const RELAY_URL: string | undefined = process.env.RELAY_URL;
const SYSTEM_NSEC: string | undefined = process.env.SYSTEM_NSEC;

let _systemPubkey: string | undefined;

function getSystemPubkey(): string | undefined {
  if (!SYSTEM_NSEC) return undefined;
  if (!_systemPubkey) {
    try {
      const privBytes = hexToBytes(SYSTEM_NSEC);
      _systemPubkey = bytesToHex(schnorr.getPublicKey(privBytes));
    } catch {
      return undefined;
    }
  }
  return _systemPubkey;
}

interface RelayPublishBody {
  kind: number;
  payload: unknown;
  z2npub: string;
  timestamp: string;
}

interface NostrWireEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

function buildWireEvent(
  body: RelayPublishBody,
  pubkey: string,
  privBytes: Uint8Array,
): NostrWireEvent {
  const created_at = Math.floor(new Date(body.timestamp).getTime() / 1000);
  const tags: string[][] = [["z2npub", body.z2npub]];
  const content = JSON.stringify(body.payload);

  const canonical = JSON.stringify([0, pubkey, created_at, body.kind, tags, content]);
  const idBytes = sha256(new TextEncoder().encode(canonical));
  const id = bytesToHex(idBytes);
  const sig = bytesToHex(schnorr.sign(idBytes, privBytes));

  return { id, pubkey, created_at, kind: body.kind, tags, content, sig };
}

function publishToRelay(wireEvent: NostrWireEvent): Promise<void> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(RELAY_URL as string);
    const timer = setTimeout(() => {
      ws.terminate();
      reject(new Error("Relay publish timed out"));
    }, 8000);

    ws.on("open", () => {
      ws.send(JSON.stringify(["EVENT", wireEvent]));
    });

    ws.on("message", (raw: Buffer) => {
      try {
        const msg = JSON.parse(raw.toString()) as unknown[];
        if (Array.isArray(msg) && msg[0] === "OK") {
          clearTimeout(timer);
          ws.close();
          if (msg[2] === true) {
            resolve();
          } else {
            reject(new Error(`Relay rejected event: ${String(msg[3])}`));
          }
        }
      } catch {
        /* ignore non-JSON frames */
      }
    });

    ws.on("error", (err: Error) => {
      clearTimeout(timer);
      reject(err);
    });

    ws.on("close", () => {
      clearTimeout(timer);
    });
  });
}

router.post("/relay/publish", async (req: Request, res: Response) => {
  if (!isOwnerRequest(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!RELAY_URL || !SYSTEM_NSEC) {
    res.status(501).json({ error: "Relay not configured" });
    return;
  }

  const pubkey = getSystemPubkey();
  if (!pubkey) {
    res.status(500).json({ error: "Invalid SYSTEM_NSEC" });
    return;
  }

  const body = req.body as RelayPublishBody;
  if (
    typeof body.kind !== "number" ||
    !body.z2npub ||
    !body.timestamp ||
    body.payload === undefined
  ) {
    res.status(400).json({ error: "kind, z2npub, timestamp, and payload required" });
    return;
  }

  let privBytes: Uint8Array;
  try {
    privBytes = hexToBytes(SYSTEM_NSEC);
  } catch {
    res.status(500).json({ error: "Failed to decode SYSTEM_NSEC" });
    return;
  }

  try {
    const wireEvent = buildWireEvent(body, pubkey, privBytes);
    await publishToRelay(wireEvent);
    res.json({ ok: true, id: wireEvent.id });
  } catch (err) {
    res.status(502).json({ error: err instanceof Error ? err.message : "Relay publish failed" });
  }
});

export default router;
