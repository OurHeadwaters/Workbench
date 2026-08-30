import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";

const LETTER_WIDTH_PX = 8.5 * 96;
const LETTER_HEIGHT_PX = 11 * 96;
const MOBILE_GUTTER_PX = 32;

interface LetterPageStageProps {
  children: ReactNode;
}

export function LetterPageStage({ children }: LetterPageStageProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      const nextScale = Math.min(
        1,
        Math.max(0.25, (window.innerWidth - MOBILE_GUTTER_PX) / LETTER_WIDTH_PX),
      );
      setScale(nextScale);
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const stageStyle: CSSProperties & { "--page-scale"?: number } = {
    "--page-scale": scale,
  };

  if (scale < 1) {
    stageStyle.height = `${LETTER_HEIGHT_PX * scale + MOBILE_GUTTER_PX}px`;
  }

  return (
    <div className="letter-page-stage" style={stageStyle}>
      {children}
    </div>
  );
}