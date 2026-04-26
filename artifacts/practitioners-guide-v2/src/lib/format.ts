const fmtUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const fmtUSD2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const fmtNum = new Intl.NumberFormat("en-US");

export function money(n: number, decimals = 0): string {
  if (!Number.isFinite(n)) return "—";
  if (decimals === 2) return fmtUSD2.format(n);
  return fmtUSD.format(n);
}

export function moneyDelta(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${money(Math.abs(n))}`;
}

export function num(n: number): string {
  return fmtNum.format(n);
}

export function pct(n: number, decimals = 0): string {
  return `${n.toFixed(decimals)}%`;
}
