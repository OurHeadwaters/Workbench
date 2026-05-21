export function IconSeed({ size = 28, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <ellipse cx="14" cy="17" rx="7" ry="8" stroke={color} strokeWidth="1.5" fill="none"/>
      <path d="M14 17 C14 12 10 8 6 6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 17 C14 12 18 8 22 6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 9 L14 4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 6 L14 4 L16 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconLedger({ size = 28, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="5" y="4" width="15" height="20" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M5 8 L20 8" stroke={color} strokeWidth="1.2"/>
      <path d="M8 12 L17 12" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M8 15.5 L17 15.5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M8 19 L13 19" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M3 6 L5 6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M3 12 L5 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M3 18 L5 18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconRiver({ size = 28, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 8 Q8 6 12 9 Q16 12 20 9 Q23 7 24 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M4 13 Q8 11 12 14 Q16 17 20 14 Q23 12 24 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M4 18 Q8 16 12 19 Q16 22 20 19 Q23 17 24 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export function IconCommunity({ size = 28, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="9" stroke={color} strokeWidth="1.5"/>
      <circle cx="14" cy="14" r="3" stroke={color} strokeWidth="1.3"/>
      <circle cx="14" cy="5" r="1.8" stroke={color} strokeWidth="1.3"/>
      <circle cx="21.8" cy="10.5" r="1.8" stroke={color} strokeWidth="1.3"/>
      <circle cx="21.8" cy="17.5" r="1.8" stroke={color} strokeWidth="1.3"/>
      <circle cx="14" cy="23" r="1.8" stroke={color} strokeWidth="1.3"/>
      <circle cx="6.2" cy="17.5" r="1.8" stroke={color} strokeWidth="1.3"/>
      <circle cx="6.2" cy="10.5" r="1.8" stroke={color} strokeWidth="1.3"/>
    </svg>
  );
}

export function IconCanoe({ size = 28, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 16 Q8 10 14 10 Q20 10 24 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M4 16 Q8 22 14 22 Q20 22 24 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M14 10 L14 6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 7 L14 6 L17 7" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 19 L8 13" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M6 14.5 L8 13 L10 14.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ModuleIcon({
  moduleId,
  size = 28,
  color = "currentColor",
}: {
  moduleId: string;
  size?: number;
  color?: string;
}) {
  switch (moduleId) {
    case "m1": return <IconSeed size={size} color={color} />;
    case "m2": return <IconLedger size={size} color={color} />;
    case "m3": return <IconRiver size={size} color={color} />;
    case "m4": return <IconCommunity size={size} color={color} />;
    case "m5": return <IconCanoe size={size} color={color} />;
    default:   return <IconSeed size={size} color={color} />;
  }
}

export function IconRaven({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <g transform="translate(18,18)">
        <path
          d="M0 -4 C-3 -8 -9 -7 -10 -3 C-11 0 -8 3 -4 3 L4 3 C8 3 11 0 10 -3 C9 -7 3 -8 0 -4Z"
          fill="#1a120a"
        />
        <path d="M-10 -3 C-14 -5 -16 -2 -15 2 C-14 5 -10 3 -4 3" fill="#1a120a"/>
        <path d="M10 -3 C14 -5 16 -2 15 2 C14 5 10 3 4 3" fill="#1a120a"/>
        <path d="M-2 -7 C-2 -10 0 -12 2 -10 C4 -8 3 -6 0 -4" fill="#2d2010"/>
        <circle cx="2" cy="-5" r="1" fill="#a8c8d8"/>
        <path d="M2 -2 L5 0 L2 1" fill="#c97d2e"/>
        <path d="M-4 3 L-6 8 M4 3 L6 8" stroke="#1a120a" strokeWidth="1.2" strokeLinecap="round"/>
      </g>
    </svg>
  );
}
