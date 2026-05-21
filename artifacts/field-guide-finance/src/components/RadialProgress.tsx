interface RadialProgressProps {
  progress: number;
  size?: number;
  label?: string;
}

export function RadialProgress({ progress, size = 52, label }: RadialProgressProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `Progress: ${progress}%`}
      style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
    >
      <svg
        width={size}
        height={size}
        className="radial-progress"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          className="radial-progress-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--cream-dark)"
          strokeWidth="3"
        />
        <circle
          className="radial-progress-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--amber)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <span
        style={{
          position: "absolute",
          fontSize: "0.6rem",
          fontWeight: 700,
          color: "var(--amber)",
          fontFamily: "var(--font-sans)",
          letterSpacing: "0.01em",
          lineHeight: 1,
        }}
      >
        {progress}%
      </span>
    </div>
  );
}
