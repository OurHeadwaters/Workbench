import { QRCodeSVG } from "qrcode.react";

const DEFAULT_URL = "https://ourheadwaters.ca";

interface QRCodeStampProps {
  light?: boolean;
  size?: number;
  url?: string;
}

export default function QRCodeStamp({ light = false, size = 72, url = DEFAULT_URL }: QRCodeStampProps) {
  const label = url.replace(/^https?:\/\//, "");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.18rem",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "4px",
          borderRadius: 4,
          lineHeight: 0,
        }}
      >
        <QRCodeSVG
          value={url}
          size={size}
          level="M"
          fgColor="#1f3d2e"
          bgColor="white"
        />
      </div>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.52rem",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: light ? "rgba(244,237,224,0.55)" : "var(--muted)",
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </div>
  );
}
