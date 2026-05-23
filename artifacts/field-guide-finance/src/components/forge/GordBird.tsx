import { useEffect, useRef } from "react";

export type GordVariant = "full" | "head" | "perch";

interface GordBirdProps {
  size?: number;
  variant?: GordVariant;
  animated?: boolean;
  blinking?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const GORD_STYLES = `
@keyframes gordBubbleIn {
  from { opacity: 0; transform: translateY(8px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes gordFloat {
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50% { transform: translateY(-5px) rotate(2deg); }
}
@keyframes gordTilt {
  0%, 40%, 100% { transform: rotate(0deg); }
  15% { transform: rotate(-5deg); }
  25% { transform: rotate(4deg); }
}
@keyframes gordBlink {
  0%, 92%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.08); }
}
@keyframes gordPerchBob {
  0%, 100% { transform: translateY(0px) rotate(-1deg); }
  50% { transform: translateY(-2px) rotate(1deg); }
}
@keyframes gordWingRuffle {
  0%, 80%, 100% { transform: scaleX(1); }
  85% { transform: scaleX(1.07); }
}
.gord-float { animation: gordFloat 4s ease-in-out infinite; }
.gord-tilt { animation: gordTilt 6s ease-in-out infinite; }
.gord-perch-bob { animation: gordPerchBob 3s ease-in-out infinite; }
.gord-blink { animation: gordBlink 5s ease-in-out infinite; transform-origin: center; }
.gord-wing-l { animation: gordWingRuffle 7s ease-in-out infinite; transform-origin: right center; }
.gord-wing-r { animation: gordWingRuffle 7s ease-in-out infinite 0.3s; transform-origin: left center; }
`;

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === "undefined") return;
  const tag = document.createElement("style");
  tag.textContent = GORD_STYLES;
  document.head.appendChild(tag);
  stylesInjected = true;
}

export function GordBird({
  size = 44,
  variant = "full",
  animated = true,
  style,
  className,
}: GordBirdProps) {
  useEffect(() => { injectStyles(); }, []);

  if (variant === "head") {
    const w = size;
    const h = size * 0.85;
    return (
      <svg
        width={w}
        height={h}
        viewBox="0 0 44 37"
        style={style}
        className={className}
      >
        <g className={animated ? "gord-tilt" : ""} style={{ transformOrigin: "22px 22px" }}>
          <ellipse cx="22" cy="20" rx="14" ry="13" fill="#7A4F2D" />
          <ellipse cx="22" cy="21" rx="11" ry="9.5" fill="#C8913A" />
          <ellipse cx="22" cy="22" rx="8.5" ry="7.5" fill="#F0CFA0" />
          <polygon points="14,9 17,4 20,10" fill="#7A4F2D" />
          <polygon points="24,10 27,4 30,9" fill="#7A4F2D" />
          <g className={animated ? "gord-blink" : ""} style={{ transformOrigin: "16px 20px" }}>
            <circle cx="16" cy="20" r="5.5" fill="white" />
            <circle cx="16" cy="20" r="4.5" fill="#F5F0E8" />
            <circle cx="16.8" cy="20.2" r="2.8" fill="#1a0d00" />
            <circle cx="17.6" cy="19.2" r="1" fill="white" />
          </g>
          <g className={animated ? "gord-blink" : ""} style={{ transformOrigin: "28px 20px", animationDelay: "0.15s" }}>
            <circle cx="28" cy="20" r="5.5" fill="white" />
            <circle cx="28" cy="20" r="4.5" fill="#F5F0E8" />
            <circle cx="28.8" cy="20.2" r="2.8" fill="#1a0d00" />
            <circle cx="29.6" cy="19.2" r="1" fill="white" />
          </g>
          <polygon points="20.5,24 23.5,24 22,27" fill="#D97706" />
          <line x1="22" y1="27" x2="22" y2="28.5" stroke="#D97706" strokeWidth="1" />
        </g>
        <g style={{ transform: "translateY(30px)" }}>
          <path d="M16,2 Q14,6 12,6 Q14,7 16,7" fill="#8B6F3A" />
          <path d="M28,2 Q30,6 32,6 Q30,7 28,7" fill="#8B6F3A" />
        </g>
      </svg>
    );
  }

  if (variant === "perch") {
    return (
      <svg
        width={size}
        height={size * 1.1}
        viewBox="0 0 44 48"
        style={style}
        className={className}
      >
        <g className={animated ? "gord-perch-bob" : ""} style={{ transformOrigin: "22px 24px" }}>
          <ellipse cx="22" cy="34" rx="12" ry="11" fill="#7A4F2D" />
          <ellipse cx="16" cy="32" rx="4.5" ry="8" fill="#6B4428" className={animated ? "gord-wing-l" : ""} />
          <ellipse cx="28" cy="32" rx="4.5" ry="8" fill="#6B4428" className={animated ? "gord-wing-r" : ""} />
          <ellipse cx="22" cy="34" rx="12" ry="11" fill="#7A4F2D" opacity="0.7"/>
          <path d="M14,42 Q12,44 10,45 M14,42 Q13,45 14,47" stroke="#8B6F3A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M30,42 Q32,44 34,45 M30,42 Q31,45 30,47" stroke="#8B6F3A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <ellipse cx="22" cy="20" rx="13" ry="12.5" fill="#7A4F2D" />
          <ellipse cx="22" cy="21" rx="10.5" ry="9" fill="#C8913A" />
          <ellipse cx="22" cy="22" rx="8" ry="7" fill="#F0CFA0" />
          <polygon points="14,10 17,5 20,11" fill="#7A4F2D" />
          <polygon points="24,11 27,5 30,10" fill="#7A4F2D" />
          <g className={animated ? "gord-blink" : ""} style={{ transformOrigin: "16px 21px" }}>
            <circle cx="16" cy="21" r="5" fill="white" />
            <circle cx="16.7" cy="21.3" r="2.6" fill="#1a0d00" />
            <circle cx="17.4" cy="20.3" r="0.9" fill="white" />
          </g>
          <g className={animated ? "gord-blink" : ""} style={{ transformOrigin: "28px 21px", animationDelay: "0.2s" }}>
            <circle cx="28" cy="21" r="5" fill="white" />
            <circle cx="28.7" cy="21.3" r="2.6" fill="#1a0d00" />
            <circle cx="29.4" cy="20.3" r="0.9" fill="white" />
          </g>
          <polygon points="20.5,25 23.5,25 22,28" fill="#D97706" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size * 1.12}
      viewBox="0 0 44 49"
      style={style}
      className={className}
    >
      <g className={animated ? "gord-float" : ""} style={{ transformOrigin: "22px 24px" }}>
        <ellipse cx="22" cy="35" rx="12.5" ry="11.5" fill="#7A4F2D" />
        <ellipse cx="15.5" cy="33" rx="5" ry="9" fill="#6B4428" className={animated ? "gord-wing-l" : ""} />
        <ellipse cx="28.5" cy="33" rx="5" ry="9" fill="#6B4428" className={animated ? "gord-wing-r" : ""} />
        <ellipse cx="22" cy="35" rx="12.5" ry="11.5" fill="#7A4F2D" opacity="0.6"/>
        <path d="M17,44 Q15,46 13,47" stroke="#8B6F3A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M17,44 Q16,47 17,49" stroke="#8B6F3A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M27,44 Q29,46 31,47" stroke="#8B6F3A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M27,44 Q28,47 27,49" stroke="#8B6F3A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <g className={animated ? "gord-tilt" : ""} style={{ transformOrigin: "22px 21px" }}>
          <ellipse cx="22" cy="21" rx="13.5" ry="13" fill="#7A4F2D" />
          <ellipse cx="22" cy="22" rx="11" ry="9.5" fill="#C8913A" />
          <ellipse cx="22" cy="23" rx="8.5" ry="7.5" fill="#F0CFA0" />
          <polygon points="13,10 16.5,4.5 19.5,11" fill="#7A4F2D" />
          <polygon points="24.5,11 27.5,4.5 31,10" fill="#7A4F2D" />
          <g className={animated ? "gord-blink" : ""} style={{ transformOrigin: "16px 22px" }}>
            <circle cx="16" cy="22" r="5.5" fill="white" />
            <circle cx="16" cy="22" r="4.5" fill="#F5F0E8" />
            <circle cx="16.8" cy="22.3" r="2.8" fill="#1a0d00" />
            <circle cx="17.6" cy="21.2" r="1" fill="white" />
          </g>
          <g className={animated ? "gord-blink" : ""} style={{ transformOrigin: "28px 22px", animationDelay: "0.18s" }}>
            <circle cx="28" cy="22" r="5.5" fill="white" />
            <circle cx="28" cy="22" r="4.5" fill="#F5F0E8" />
            <circle cx="28.8" cy="22.3" r="2.8" fill="#1a0d00" />
            <circle cx="29.6" cy="21.2" r="1" fill="white" />
          </g>
          <polygon points="20.5,26.5 23.5,26.5 22,29.5" fill="#D97706" />
          <line x1="22" y1="29.5" x2="22" y2="31" stroke="#D97706" strokeWidth="1.2" />
        </g>
      </g>
    </svg>
  );
}
