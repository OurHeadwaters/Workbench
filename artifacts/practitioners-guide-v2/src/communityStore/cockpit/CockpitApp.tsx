import { useState } from "react";
import { CockpitShell, type CockpitScreen } from "./CockpitShell";
import Pitch from "./screens/Pitch";
import FloorPlan from "./screens/FloorPlan";
import OperatorHome from "./screens/OperatorHome";
import Till from "./screens/Till";
import Locks from "./screens/Locks";

export default function CockpitApp({ onBack }: { onBack: () => void }) {
  const [screen, setScreen] = useState<CockpitScreen>("pitch");
  const [tillVisible, setTillVisible] = useState(false);

  const handleNavigate = (s: CockpitScreen) => {
    setScreen(s);
    setTillVisible(false);
  };

  return (
    <CockpitShell screen={screen} onNavigate={handleNavigate} onBack={onBack}>
      {screen === "pitch" && <Pitch onNavigate={handleNavigate} />}
      {screen === "floor" && <FloorPlan />}
      {screen === "home" && !tillVisible && (
        <OperatorHome onNavigateTill={() => { setScreen("till"); setTillVisible(true); }} />
      )}
      {screen === "till" && <Till onBack={() => handleNavigate("home")} />}
      {screen === "locks" && <Locks />}
    </CockpitShell>
  );
}
