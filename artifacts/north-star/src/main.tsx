import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { registerRelayOnlineDrain } from "./lib/relay-stub";

// Drain any events that were queued while offline, and re-drain whenever
// the browser reports that connectivity has been restored.
registerRelayOnlineDrain();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
