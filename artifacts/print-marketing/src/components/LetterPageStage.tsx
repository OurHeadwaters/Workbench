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

  const viewportStyle: CSSProperties = {
    width: `${LETTER_WIDTH_PX * scale}px`,
    height: `${LETTER_HEIGHT_PX * scale}px`,
  };

  return (
    <div className="letter-page-stage" style={stageStyle}>
      <div className="letter-page-stage__viewport" style={viewportStyle}>
        {children}
      </div>
    </div>
  );
}