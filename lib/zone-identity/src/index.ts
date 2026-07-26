import { hkdfSync } from "node:crypto";

/**
 * HKDF-SHA256 domain separator for Zone 2 npub derivation.
 * Changing this value would invalidate all existing Z2 identities.
 */
const DOMAIN_SEPARATOR = "headwaters:zone:Z2:npub";

/** bech32 alphabet as specified in BIP-0173 / NIP-19 */
const BECH32_ALPHABET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

/** bech32 generator polynomial coefficients */
const BECH32_GENERATOR = [
  0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3,
];

function bech32Polymod(values: number[]): number {
  let chk = 1;
  for (const v of values) {
    const top = chk >> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ v;
    for (let i = 0; i < 5; i++) {
      if ((top >> i) & 1) chk ^= BECH32_GENERATOR[i];
    }
  }
  return chk;
}

function bech32HrpExpand(hrp: string): number[] {
  const ret: number[] = [];
  for (let i = 0; i < hrp.length; i++) ret.push(hrp.charCodeAt(i) >> 5);
  ret.push(0);
  for (let i = 0; i < hrp.length; i++) ret.push(hrp.charCodeAt(i) & 31);
  return ret;
}

function bech32CreateChecksum(hrp: string, data: number[]): number[] {
  const values = bech32HrpExpand(hrp).concat(data).concat([0, 0, 0, 0, 0, 0]);
  const mod = bech32Polymod(values) ^ 1;
  const ret: number[] = [];
  for (let i = 0; i < 6; i++) ret.push((mod >> (5 * (5 - i))) & 31);
  return ret;
}

/** Convert a Uint8Array of 8-bit bytes to an array of 5-bit groups (for bech32). */
function convertBits(data: Uint8Array, from: number, to: number): number[] {
  let acc = 0;
  let bits = 0;
  const result: number[] = [];
  const maxv = (1 << to) - 1;
  for (const value of data) {
    acc = (acc << from) | value;
    bits += from;
    while (bits >= to) {
      bits -= to;
      result.push((acc >> bits) & maxv);
    }
  }
  if (bits > 0) result.push((acc << (to - bits)) & maxv);
  return result;
}

function bech32Encode(hrp: string, data: Uint8Array): string {
  const converted = convertBits(data, 8, 5);
  const checksum = bech32CreateChecksum(hrp, converted);
  const combined = converted.concat(checksum);
  return hrp + "1" + combined.map((d) => BECH32_ALPHABET[d]).join("");
}

/**
 * Derives a Zone 2 Workbench identity (npub) from a household seed.
 *
 * ## Eave Rule compliance
 *
 * This function is **one-way and non-reversible** by construction:
 *
 * - HKDF-SHA256 is a key-derivation function, not a cipher — there is no
 *   inverse operation.
 * - The 32-byte output is a pseudonymous Z2 identifier only. It does not
 *   encode, embed, or expose any Z1 household identity field (name,
 *   passphrase, or any personally identifying information).
 * - The derived npub must **never** be stored alongside any Z1 record, nor
 *   used to look up a Z1 identity. The Z1–Z3 absolute prohibition applies:
 *   this identifier may appear at the Z2–Z3 gate for audit purposes but must
 *   not create a composable path back to the household.
 * - The domain separator `"headwaters:zone:Z2:npub"` ensures outputs from
 *   this function are cryptographically separated from any other HKDF
 *   derivation in the system.
 *
 * @param householdSeed - A secret, high-entropy byte array that represents
 *   the household's root secret material. Must be at least 1 byte. In
 *   practice this should be 32+ bytes of random data. The seed itself is
 *   never stored or transmitted.
 * @returns A bech32-encoded npub string compatible with the Nostr NIP-19
 *   encoding format, suitable for use as a Z2 Workbench relay identity.
 * @throws {Error} if `householdSeed` is zero-length.
 */
export function deriveZ2Npub(householdSeed: Uint8Array): string {
  if (householdSeed.length === 0) {
    throw new Error(
      "deriveZ2Npub: householdSeed must not be empty — a zero-length seed provides no entropy"
    );
  }

  const keyMaterial = hkdfSync(
    "sha256",
    householdSeed,
    new Uint8Array(32),
    Buffer.from(DOMAIN_SEPARATOR, "utf8"),
    32
  );

  return bech32Encode("npub", new Uint8Array(keyMaterial));
}
