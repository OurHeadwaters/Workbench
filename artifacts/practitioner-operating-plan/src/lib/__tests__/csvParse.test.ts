import { describe, it, expect } from "vitest";
import { findHeader, parseCsv, parseMoney, parseNumber } from "../csvParse";

describe("parseCsv", () => {
  it("parses a comma-delimited CSV with a header row", () => {
    const { headers, rows } = parseCsv("a,b,c\n1,2,3\n4,5,6\n");
    expect(headers).toEqual(["a", "b", "c"]);
    expect(rows).toEqual([
      { a: "1", b: "2", c: "3" },
      { a: "4", b: "5", c: "6" },
    ]);
  });

  it("locks the delimiter from the first separator (comma vs tab)", () => {
    const tsv = "a\tb\tc\n1\t2,3\t4\n";
    const { headers, rows } = parseCsv(tsv);
    expect(headers).toEqual(["a", "b", "c"]);
    expect(rows[0]).toEqual({ a: "1", b: "2,3", c: "4" });
  });

  it("respects quoted cells with embedded commas, quotes, and newlines", () => {
    const csv = 'name,note\n"Acme, LLC","line1\nline2"\n"O""Brien","ok"\n';
    const { rows } = parseCsv(csv);
    expect(rows).toEqual([
      { name: "Acme, LLC", note: "line1\nline2" },
      { name: 'O"Brien', note: "ok" },
    ]);
  });

  it("strips a UTF-8 BOM and trailing blank rows", () => {
    const csv = "\uFEFFa,b\n1,2\n\n";
    const { headers, rows } = parseCsv(csv);
    expect(headers).toEqual(["a", "b"]);
    expect(rows).toHaveLength(1);
  });

  it("returns empty headers/rows on empty input", () => {
    expect(parseCsv("")).toEqual({ headers: [], rows: [] });
    expect(parseCsv("   \n\n")).toEqual({ headers: [], rows: [] });
  });
});

describe("findHeader", () => {
  it("prefers an exact match over a substring match", () => {
    const headers = ["Gross Sales", "Net Sales", "Sales"];
    expect(findHeader(headers, ["Net Sales", "Gross Sales"])).toBe("Net Sales");
  });

  it("walks the candidate list in order, returning the first exact match", () => {
    // "Net Sales" is the first candidate and present, so it must win even
    // though "Gross Sales" is also in the headers.
    const headers = ["SKU", "Gross Sales", "Net Sales"];
    expect(
      findHeader(headers, [
        "Net Sales",
        "Net Sale",
        "Net Amount",
        "Gross Sales",
        "Sales",
      ]),
    ).toBe("Net Sales");
  });

  it("falls back to substring match when no exact match exists", () => {
    const headers = ["SKU", "Net Sales (Excl. Tax)"];
    expect(findHeader(headers, ["Net Sales"])).toBe("Net Sales (Excl. Tax)");
  });

  it("does exact matches across ALL candidates before any substring match", () => {
    // Even though "Gross Sales" also appears as a substring of "Gross Sales (incl. tax)"
    // the exact match for "Sales" should NOT short-circuit a later exact for
    // a candidate listed later. The function searches every candidate exact
    // first, then every candidate substring; "Sales" exact-matches first.
    const headers = ["Gross Sales (incl. tax)", "Sales"];
    expect(findHeader(headers, ["Net Sales", "Sales"])).toBe("Sales");
  });

  it("returns null when nothing matches", () => {
    expect(findHeader(["SKU", "Qty"], ["Revenue"])).toBeNull();
  });
});

describe("parseMoney", () => {
  it("parses plain numbers and currency-formatted strings", () => {
    expect(parseMoney("1234.56")).toBe(1234.56);
    expect(parseMoney("$1,234.56")).toBe(1234.56);
    expect(parseMoney("  $1,234.56 ")).toBe(1234.56);
  });

  it("parses accounting-style negatives with parentheses", () => {
    expect(parseMoney("($45.00)")).toBe(-45);
    expect(parseMoney("($1,234.56)")).toBe(-1234.56);
  });

  it("parses leading-minus negatives", () => {
    expect(parseMoney("-45.00")).toBe(-45);
    expect(parseMoney("-$1,234.56")).toBe(-1234.56);
  });

  it("returns 0 for empty or unparseable strings", () => {
    expect(parseMoney("")).toBe(0);
    expect(parseMoney(undefined)).toBe(0);
    expect(parseMoney("not a number")).toBe(0);
  });

  it("ignores stray currency letters", () => {
    expect(parseMoney("CAD 1,234.56")).toBe(1234.56);
  });
});

describe("parseNumber", () => {
  it("parses numbers, stripping commas and whitespace", () => {
    expect(parseNumber("1,234")).toBe(1234);
    expect(parseNumber(" 12 ")).toBe(12);
    expect(parseNumber("3.5")).toBe(3.5);
  });

  it("returns 0 for empty or non-numeric strings", () => {
    expect(parseNumber("")).toBe(0);
    expect(parseNumber(undefined)).toBe(0);
    expect(parseNumber("abc")).toBe(0);
  });
});
