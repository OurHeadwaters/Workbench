import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { loadSlides } from "./slideLoader";

const slides = loadSlides();

function SlideViewer({ index }: { index: number }) {
  const slide = slides[index];
  if (!slide) return null;
  const Component = slide.component;
  return <Component />;
}

function AllSlides() {
  return (
    <div>
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="slide"
          style={{ width: 1920, height: 1080, overflow: "hidden", position: "relative" }}
        >
          <slide.component />
        </div>
      ))}
    </div>
  );
}

function SlideEditor({ index }: { index: number }) {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "177.78vh", aspectRatio: "16/9" }}>
        <SlideViewer index={index} />
      </div>
    </div>
  );
}

export default function App() {
  const [location, navigate] = useLocation();

  // DO NOT edit: unknown-route redirect
  useEffect(() => {
    const validPaths = ["/", "/allslides", ...slides.map((_, i) => `/slide${i + 1}`)];
    if (!validPaths.includes(location)) {
      navigate("/slide1", { replace: true });
    }
  }, [location, navigate]);

  // DO NOT edit: parent navigateToSlide postMessage listener
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "navigateToSlide" && typeof e.data.index === "number") {
        navigate(`/slide${e.data.index + 1}`);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  return (
    <Switch>
      <Route path="/allslides" component={AllSlides} />
      {slides.map((_, i) => (
        <Route key={i} path={`/slide${i + 1}`}>
          <SlideEditor index={i} />
        </Route>
      ))}
      <Route path="/">
        <SlideEditor index={0} />
      </Route>
    </Switch>
  );
}
