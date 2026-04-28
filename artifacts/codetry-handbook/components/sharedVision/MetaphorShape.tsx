import React from "react";

import { Circle, Line, Path, Rect, Svg } from "@/lib/sharedVision/svg";
import type { MetaphorShapeKind } from "@/lib/sharedVision/types";

interface Props {
  kind: MetaphorShapeKind;
  color: string;
  size?: number;
}

export function MetaphorShape({ kind, color, size = 64 }: Props) {
  const stroke = 1.8;
  const common = {
    stroke: color,
    strokeWidth: stroke,
    fill: "none" as const,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const v = 64;
  switch (kind) {
    case "bucket":
      return (
        <Svg width={size} height={size} viewBox={`0 0 ${v} ${v}`}>
          <Path
            d="M14 22 L18 52 Q18 56 22 56 L42 56 Q46 56 46 52 L50 22 Z"
            {...common}
          />
          <Path d="M14 22 Q32 16 50 22" {...common} />
          <Path d="M20 18 Q32 8 44 18" {...common} />
        </Svg>
      );
    case "shelf":
      return (
        <Svg width={size} height={size} viewBox={`0 0 ${v} ${v}`}>
          <Line x1="8" y1="38" x2="56" y2="38" {...common} />
          <Line x1="10" y1="38" x2="10" y2="48" {...common} />
          <Line x1="54" y1="38" x2="54" y2="48" {...common} />
          <Rect x="14" y="22" width="8" height="16" rx="1" {...common} />
          <Rect x="26" y="18" width="6" height="20" rx="1" {...common} />
          <Rect x="36" y="26" width="14" height="12" rx="2" {...common} />
        </Svg>
      );
    case "jar":
      return (
        <Svg width={size} height={size} viewBox={`0 0 ${v} ${v}`}>
          <Path
            d="M22 22 L22 50 Q22 54 26 54 L38 54 Q42 54 42 50 L42 22 Z"
            {...common}
          />
          <Path d="M22 22 Q32 18 42 22" {...common} />
          <Rect x="20" y="12" width="24" height="8" rx="2" {...common} />
        </Svg>
      );
    case "deck":
      return (
        <Svg width={size} height={size} viewBox={`0 0 ${v} ${v}`}>
          <Rect x="14" y="20" width="28" height="36" rx="3" {...common} />
          <Rect x="18" y="16" width="28" height="36" rx="3" {...common} />
          <Rect x="22" y="12" width="28" height="36" rx="3" {...common} />
        </Svg>
      );
    case "board":
      return (
        <Svg width={size} height={size} viewBox={`0 0 ${v} ${v}`}>
          <Rect x="10" y="12" width="44" height="40" rx="2" {...common} />
          <Circle cx="20" cy="22" r="2" {...common} />
          <Circle cx="32" cy="22" r="2" {...common} />
          <Circle cx="44" cy="22" r="2" {...common} />
          <Line x1="16" y1="34" x2="48" y2="34" {...common} />
          <Line x1="16" y1="42" x2="40" y2="42" {...common} />
        </Svg>
      );
    case "drawer":
      return (
        <Svg width={size} height={size} viewBox={`0 0 ${v} ${v}`}>
          <Rect x="10" y="20" width="44" height="28" rx="2" {...common} />
          <Line x1="10" y1="34" x2="54" y2="34" {...common} />
          <Circle cx="32" cy="27" r="2" {...common} />
          <Circle cx="32" cy="41" r="2" {...common} />
        </Svg>
      );
    case "basket":
      return (
        <Svg width={size} height={size} viewBox={`0 0 ${v} ${v}`}>
          <Path
            d="M14 26 L18 52 Q18 56 22 56 L42 56 Q46 56 46 52 L50 26 Z"
            {...common}
          />
          <Path d="M20 12 Q32 6 44 12 L50 26 L14 26 Z" {...common} />
          <Line x1="22" y1="28" x2="26" y2="54" {...common} />
          <Line x1="32" y1="28" x2="32" y2="56" {...common} />
          <Line x1="42" y1="28" x2="38" y2="54" {...common} />
        </Svg>
      );
    case "stack":
      return (
        <Svg width={size} height={size} viewBox={`0 0 ${v} ${v}`}>
          <Rect x="12" y="44" width="40" height="8" rx="1.5" {...common} />
          <Rect x="14" y="34" width="36" height="8" rx="1.5" {...common} />
          <Rect x="16" y="24" width="32" height="8" rx="1.5" {...common} />
          <Rect x="18" y="14" width="28" height="8" rx="1.5" {...common} />
        </Svg>
      );
    case "folder":
      return (
        <Svg width={size} height={size} viewBox={`0 0 ${v} ${v}`}>
          <Path
            d="M10 20 L10 50 Q10 54 14 54 L50 54 Q54 54 54 50 L54 24 Q54 20 50 20 L30 20 L26 16 L14 16 Q10 16 10 20 Z"
            {...common}
          />
        </Svg>
      );
    case "thread":
      return (
        <Svg width={size} height={size} viewBox={`0 0 ${v} ${v}`}>
          <Path
            d="M8 32 Q16 18 24 32 Q32 46 40 32 Q48 18 56 32"
            {...common}
          />
          <Circle cx="8" cy="32" r="2.5" {...common} />
          <Circle cx="56" cy="32" r="2.5" {...common} />
        </Svg>
      );
    case "custom":
    default:
      return (
        <Svg width={size} height={size} viewBox={`0 0 ${v} ${v}`}>
          <Circle
            cx="32"
            cy="32"
            r="20"
            {...common}
            strokeDasharray="3 3"
          />
          <Path
            d="M26 28 Q26 22 32 22 Q38 22 38 28 Q38 32 32 33 L32 36"
            {...common}
          />
          <Circle cx="32" cy="42" r="1.5" fill={color} stroke="none" />
        </Svg>
      );
  }
}
